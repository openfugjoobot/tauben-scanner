#!/bin/bash
# Emergency Stop Script for Self-Improvement System
# Immediately disables all self-improvement functionality

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
RATE_LIMITER="$WORKSPACE_DIR/rate_limiter.py"

echo "🚨 EMERGENCY STOP ACTIVATED 🚨"
echo "================================="
echo "Shutting down self-improvement system immediately..."
echo

# Check if script exists and is executable
if [[ ! -f "$RATE_LIMITER" ]]; then
    echo "❌ Error: Rate limiter not found at $RATE_LIMITER"
    exit 1
fi

# Execute emergency stop
python3 -c "
import sys
sys.path.insert(0, '$WORKSPACE_DIR')
from rate_limiter import RateLimiter
limiter = RateLimiter()
result = limiter.emergency_stop()
print('Emergency stop completed successfully')
print('\nDetails:')
for key, value in result.items():
    print(f'  {key}: {value}')
"

# Log the emergency stop
EMERGENCY_LOG="$WORKSPACE_DIR/emergency_stop.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] EMERGENCY_STOP_ACTIVATED by $USER" >> "$EMERGENCY_LOG"

# Kill any running analysis processes
echo "Stopping any running analysis processes..."
pkill -f "pattern_analyzer.py" || true
pkill -f "improvement_generator.py" || true
pkill -f "review_gate.py" || true

# Disable any pending cron jobs
echo "Disabling pending cron jobs..."
if command -v crontab >/dev/null 2>&1; then
    crontab -l | grep -v "self_improvement" | crontab - || true
fi

echo
echo "✅ Emergency stop completed successfully!"
echo "📍 Log location: $EMERGENCY_LOG"
echo
echo "To re-enable the system, run:"
echo "  $WORKSPACE_DIR/scripts/enable_system.sh"
echo
echo "System status will remain OFF until manually re-enabled."