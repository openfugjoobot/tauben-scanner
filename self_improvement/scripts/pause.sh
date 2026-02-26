#!/bin/bash
# Pause Script for Self-Improvement System
# Temporarily disables system for specified duration

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
RATE_LIMITER="$WORKSPACE_DIR/rate_limiter.py"

# Parse arguments
HOURS=${1:-24}
if ! [[ "$HOURS" =~ ^[0-9]+$ ]]; then
    echo "❌ Error: Hours must be a positive integer"
    echo "Usage: $0 [hours]"
    echo "Example: $0 24  (pause for 24 hours)"
    exit 1
fi

if [[ $HOURS -lt 1 || $HOURS -gt 168 ]]; then
    echo "❌ Error: Hours must be between 1 and 168 (1 week)"
    exit 1
fi

echo "⏸️  PAUSING SELF-IMPROVEMENT SYSTEM"
echo "==================================="
echo "Pausing system for $HOURS hour(s)..."
echo

# Check if script exists
if [[ ! -f "$RATE_LIMITER" ]]; then
    echo "❌ Error: Rate limiter not found at $RATE_LIMITER"
    exit 1
fi

# Execute pause
result=$(python3 -c "
import sys
sys.path.insert(0, '$WORKSPACE_DIR')
from rate_limiter import RateLimiter
limiter = RateLimiter()
result = limiter.pause_system($HOURS)
print('Pause completed successfully')
print('\nDetails:')
for key, value in result.items():
    print(f'  {key}: {value}')
")

echo "$result"

# Log the pause
PAUSE_LOG="$WORKSPACE_DIR/pause_log.txt"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] System paused for $HOURS hours by $USER" >> "$PAUSE_LOG"

# Show resume info
resume_time=$(date -d "+$HOURS hours" '+%Y-%m-%d %H:%M:%S')
echo
echo "✅ System paused successfully!"
echo "📍 Log location: $PAUSE_LOG"
echo "🔄 Auto-resume at: $resume_time"
echo
echo "To resume manually before then, run:"
echo "  $WORKSPACE_DIR/scripts/enable_system.sh"
echo
echo "To check status, run:"
echo "  $WORKSPACE_DIR/scripts/status.sh"