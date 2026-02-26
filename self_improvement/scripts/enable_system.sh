#!/bin/bash
# Enable Script for Self-Improvement System
# Re-enables the system after pause or emergency stop

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
SAFETY_SWITCHES="$WORKSPACE_DIR/safety_switches.json"

echo "🟢 ENABLING SELF-IMPROVEMENT SYSTEM"
echo "==================================="
echo "Re-enabling self-improvement system..."
echo

# Check if safety switches file exists
if [[ ! -f "$SAFETY_SWITCHES" ]]; then
    echo "❌ Error: Safety switches file not found at $SAFETY_SWITCHES"
    exit 1
fi

# Enable the main system
python3 -c "
import json
import sys

# Load safety switches
with open('$SAFETY_SWITCHES', 'r') as f:
    switches = json.load(f)

# Enable main system (user must explicitly enable others)
switches['AI_SELF_IMPROVEMENT']['enabled'] = True

# Remove any pause timestamp
if 'resume_at' in switches['AI_SELF_IMPROVEMENT']:
    del switches['AI_SELF_IMPROVEMENT']['resume_at']

# Enable emergency stop availability
switches['EMERGENCY_STOP_AVAILABLE']['enabled'] = True

# Save changes
with open('$SAFETY_SWITCHES', 'w') as f:
    json.dump(switches, f, indent=2)

print('✅ System re-enabled successfully')
"

# Log the enable
ENABLE_LOG="$WORKSPACE_DIR/enable_log.txt"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] System re-enabled by $USER" >> "$ENABLE_LOG"

echo
echo "✅ Self-improvement system is now ENABLED"
echo "📍 Log location: $ENABLE_LOG"
echo
echo "⚠️  IMPORTANT SECURITY NOTE:"
echo "  The system is enabled but safety switches remain OFF by default."
echo "  To allow autonomous changes, you must manually enable specific switches:"
echo
echo "  • ALLOW_TIER_1_AUTO    - Auto-approve low-risk changes"
echo "  • AUTO_APPLY_CHANGES   - Allow any automatic application"
echo "  • ALLOW_SOUL_EDIT      - Permit SOUL.md changes (DANGEROUS)"
echo "  • ALLOW_AGENTS_EDIT    - Permit AGENTS.md changes (HIGH RISK)"
echo
echo "Edit with caution: $SAFETY_SWITCHES"
echo
echo "To check current safety status:"
echo "  $0 status"
echo
echo "To immediately stop the system:"
echo "  $SCRIPT_DIR/emergency_stop.sh"