#!/usr/bin/env bash
# =============================================================================
# guard-shell.sh — Cursor beforeShellExecution hook
#
# Blocks dangerous shell commands before the agent executes them.
#
# Exit code conventions (Cursor hooks):
#   0  = Allow  — command is safe, proceed with execution
#   2  = Deny   — command is blocked, agent receives denial message
#   *  = Error  — hook failed; action proceeds (fail-open by default)
#
# This script reads JSON from stdin with the shape:
#   { "command": "...", "cwd": "...", "sandbox": false }
#
# It checks the command against a blocklist of destructive patterns and
# outputs a JSON response with permission status.
# =============================================================================

set -euo pipefail

# Read the incoming JSON from stdin
INPUT=$(cat)

# Extract the command field using portable tools
COMMAND=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('command', ''))" 2>/dev/null || echo "")

if [ -z "$COMMAND" ]; then
  # No command found — allow by default
  echo '{"permission": "allow"}'
  exit 0
fi

# ---------------------------------------------------------------------------
# Blocklist patterns
#
# Each pattern is checked as a case-insensitive match against the full command
# string. Be careful with overly broad patterns to avoid false positives.
# ---------------------------------------------------------------------------

BLOCKED=""
REASON=""

# Convert command to lowercase for case-insensitive matching
CMD_LOWER=$(echo "$COMMAND" | tr '[:upper:]' '[:lower:]')

# Check for destructive filesystem commands
if echo "$CMD_LOWER" | grep -qE '(^|[;&|]\s*)rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|(-[a-zA-Z]*f[a-zA-Z]*r))\b'; then
  BLOCKED="true"
  REASON="Blocked: 'rm -rf' is a destructive command that recursively force-deletes files"
fi

# Check for destructive SQL commands
if echo "$CMD_LOWER" | grep -qE 'drop\s+table\b'; then
  BLOCKED="true"
  REASON="Blocked: 'DROP TABLE' would permanently destroy database tables"
fi

if echo "$CMD_LOWER" | grep -qE 'drop\s+database\b'; then
  BLOCKED="true"
  REASON="Blocked: 'DROP DATABASE' would permanently destroy an entire database"
fi

# Check for destructive git commands
if echo "$CMD_LOWER" | grep -qE 'git\s+push\s+.*--force\b'; then
  BLOCKED="true"
  REASON="Blocked: 'git push --force' can overwrite remote history and destroy others' work"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+reset\s+--hard\b'; then
  BLOCKED="true"
  REASON="Blocked: 'git reset --hard' discards all uncommitted changes permanently"
fi

# Check for commands referencing sensitive files (.env, credentials)
if echo "$CMD_LOWER" | grep -qE '\.env\b'; then
  BLOCKED="true"
  REASON="Blocked: command references .env file which may contain secrets"
fi

if echo "$CMD_LOWER" | grep -qE 'credentials\b'; then
  BLOCKED="true"
  REASON="Blocked: command references credentials file which may contain secrets"
fi

# ---------------------------------------------------------------------------
# Respond
# ---------------------------------------------------------------------------

if [ "$BLOCKED" = "true" ]; then
  # Use python3 for safe JSON encoding of the reason string
  python3 -c "
import json, sys
print(json.dumps({
    'permission': 'deny',
    'user_message': sys.argv[1],
    'agent_message': 'This command was blocked by the guard-shell hook. ' + sys.argv[1]
}))
" "$REASON"
  exit 2
fi

# Command is safe — allow execution
echo '{"permission": "allow"}'
exit 0
