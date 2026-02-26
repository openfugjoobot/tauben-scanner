#!/bin/bash
# Manual Analysis Trigger Script
# Triggers immediate analysis of session logs

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
CRON_SCRIPT="$WORKSPACE_DIR/cron.py"

echo "🔍 MANUAL ANALYSIS TRIGGER"
echo "========================="
echo "Triggering immediate self-improvement analysis..."
echo

# Check if cron script exists
if [[ ! -f "$CRON_SCRIPT" ]]; then
    echo "❌ Error: Cron script not found at $CRON_SCRIPT"
    exit 1
fi

# Run manual analysis
echo "Running analysis..."
python3 "$CRON_SCRIPT" analyze --workspace "$WORKSPACE_DIR"

echo
echo "✅ Manual analysis completed!"
echo
echo "📊 Results:"
echo "  Insights directory: $WORKSPACE_DIR/insights/"
echo "  Cron log:           $WORKSPACE_DIR/cron_log.txt"
echo
echo "To check system status:"
echo "  $SCRIPT_DIR/status.sh"
echo
echo "To view latest insights:"
echo "  find $WORKSPACE_DIR/insights/ -name '*.json' -type f -newer /tmp/analyze_start | head -5"