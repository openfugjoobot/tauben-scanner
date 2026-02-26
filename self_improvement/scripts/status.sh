#!/bin/bash
# Status Script for Self-Improvement System
# Shows current system status and statistics

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
RATE_LIMITER="$WORKSPACE_DIR/rate_limiter.py"

echo "📊 SELF-IMPROVEMENT SYSTEM STATUS"
echo "================================="
echo "Last updated: $(date '+%Y-%m-%d %H:%M:%S')"
echo

# Check if system components exist
missing_files=()

if [[ ! -f "$RATE_LIMITER" ]]; then
    missing_files+=("rate_limiter.py")
fi

if [[ ! -f "$WORKSPACE_DIR/rate_limits.json" ]]; then
    missing_files+=("rate_limits.json")
fi

if [[ ! -f "$WORKSPACE_DIR/safety_switches.json" ]]; then
    missing_files+=("safety_switches.json")
fi

if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo "❌ Missing system files:"
    printf '  %s\n' "${missing_files[@]}"
    echo
    exit 1
fi

# Get status from rate limiter
echo "🔧 System Status:"
python3 -c "
import sys
sys.path.insert(0, '$WORKSPACE_DIR')
from rate_limiter import RateLimiter
import json

limiter = RateLimiter()
status = limiter.get_status()

# Main status
enabled = status.get('system_enabled', False)
status_icon = '✅' if enabled else '❌'
print(f'  Main System:        {status_icon} {'ENABLED' if enabled else 'DISABLED'}')

# Safety switches
print()
print('🛡️  Safety Switches:')
switches = status.get('switches', {})
for switch_name, enabled in switches.items():
    icon = '✅' if enabled else '❌'
    # Format switch name for display
    display_name = switch_name.replace('_', ' ').title()
    print(f'  {display_name:<22}: {icon} {enabled}')

# Rate limiting
print()
print('📈 Rate Limiting:')
counters = status.get('counters', {})
for counter_name, count in counters.items():
    display_name = counter_name.replace('_', ' ').title()
    print(f'  {display_name:<22}: {count}')

# Applied changes
print()
print('📝 Applied Changes:')
print(f'  Today:              {status.get(\"applied_today_count\", 0)}')
print(f'  This Week:          {status.get(\"applied_this_week_count\", 0)}')

# Reset times
print()
print('🕐 Reset Schedule:')
print(f'  Last Daily Reset:    {status.get(\"last_reset_daily\", \"Unknown\")}')
print(f'  Last Weekly Reset:   {status.get(\"last_reset_weekly\", \"Unknown\")}')

# File system check
print()
print('📁 Directories:')
import os
dirs_to_check = [
    'proposals/pending',
    'proposals/approved', 
    'proposals/rejected',
    'insights/weekly',
    'decisions',
    'config_backups'
]

for dir_name in dirs_to_check:
    dir_path = os.path.join('$WORKSPACE_DIR', dir_name)
    exists = os.path.exists(dir_path)
    icon = '✅' if exists else '❌'
    print(f'  {dir_name:<22}: {icon}')
"

echo
echo "⚡ Quick Actions:"
echo "  Status:   $0"
echo "  Pause:    $SCRIPT_DIR/pause.sh [hours]"
echo "  Stop:     $SCRIPT_DIR/emergency_stop.sh"
echo
echo "🔗 Files:"
echo "  Rate Limits:   $WORKSPACE_DIR/rate_limits.json"
echo "  Safety Switches: $WORKSPACE_DIR/safety_switches.json"
echo "  Pause Log:     $WORKSPACE_DIR/pause_log.txt (if any)"
echo "  Emergency Log: $WORKSPACE_DIR/emergency_stop.log (if any)"