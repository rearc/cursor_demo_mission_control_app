#!/usr/bin/env bash
# =============================================================================
# auto-lint.sh — Cursor afterFileEdit hook
#
# Automatically runs the appropriate linter on files after they are edited
# by the agent, keeping code style consistent without manual intervention.
#
# Exit code conventions (Cursor hooks):
#   0  = Success — hook completed (or gracefully skipped)
#   *  = Error   — hook failed; does not block the edit (fail-open)
#
# Unlike beforeShellExecution, afterFileEdit is not a permission gate —
# it runs after the edit is already applied. We always exit 0 to avoid
# noisy failures when a linter isn't installed or the file type is unknown.
#
# This script reads JSON from stdin with the shape:
#   { "file_path": "/absolute/path/to/file", "edits": [...] }
# =============================================================================

# Don't use set -e here — we want to handle errors gracefully and always exit 0
set -uo pipefail

# Read the incoming JSON from stdin
INPUT=$(cat)

# Extract the file path
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('file_path', ''))" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  # No file path — nothing to lint
  exit 0
fi

# Check the file actually exists before trying to lint it
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Extract file extension (lowercase)
EXT=$(echo "${FILE_PATH##*.}" | tr '[:upper:]' '[:lower:]')

# ---------------------------------------------------------------------------
# Route to the appropriate linter based on file extension
#
# JS/JSX/TS/TSX → ESLint (via npx, so it uses the project's version)
# Python (.py)  → Ruff (fast Python linter/formatter)
#
# If the linter isn't installed or the file type isn't recognized, we exit 0
# to fail gracefully — the edit still goes through.
# ---------------------------------------------------------------------------

case "$EXT" in
  js|jsx|ts|tsx)
    # Run ESLint with --fix to auto-correct fixable issues
    # Use npx to pick up the project-local eslint installation
    if command -v npx &>/dev/null; then
      npx eslint --fix "$FILE_PATH" 2>/dev/null || true
    fi
    ;;

  py)
    # Run Ruff with --fix to auto-correct fixable issues
    if command -v ruff &>/dev/null; then
      ruff check --fix "$FILE_PATH" 2>/dev/null || true
    fi
    ;;

  *)
    # Unknown file type — nothing to do
    ;;
esac

# Always exit 0 — linting is best-effort and should never block edits
exit 0
