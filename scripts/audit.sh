#!/bin/bash
# =============================================================================
# audit.sh — Cursor audit hook
#
# Logs every hook event to /tmp/agent-audit.log with a timestamp, creating
# a full audit trail of everything the Cursor agent does during a session.
#
# This script is attached to every hook event in hooks.json so it captures:
#   - Session start/end
#   - Shell commands (before and after execution)
#   - MCP tool calls (before and after execution)
#   - File edits
#   - Prompt submissions
#   - Context compaction events
#   - Agent stop events
#
# Exit code conventions (Cursor hooks):
#   0  = Success — always exit 0; this is a passive observer, never blocks
# =============================================================================

# Read JSON input from stdin
json_input=$(cat)

# Create timestamp for the log entry
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Write the timestamped JSON entry to the audit log
echo "[$timestamp] $json_input" >> /tmp/agent-audit.log

# Always allow — this hook only observes, never blocks
exit 0
