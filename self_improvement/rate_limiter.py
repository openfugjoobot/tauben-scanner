#!/usr/bin/env python3
"""
Rate Limiter for Self-Improvement System
Enforces 5-tier rate limiting and quota management
"""

import json
import time
import os
from datetime import datetime, timedelta
from typing import Dict, Tuple, Optional
import hashlib

class RateLimiter:
    def __init__(self, workspace_dir: str = None):
        if workspace_dir is None:
            workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        self.workspace_dir = workspace_dir
        self.rate_limits_file = os.path.join(workspace_dir, "self_improvement", "rate_limits.json")
        self.safety_switches_file = os.path.join(workspace_dir, "self_improvement", "safety_switches.json")
        
        self.load_state()
    
    def load_state(self):
        """Load rate limits and safety switches"""
        try:
            with open(self.rate_limits_file, 'r') as f:
                self.rate_limits = json.load(f)
        except FileNotFoundError:
            self.rate_limits = self.create_default_rate_limits()
            self.save_state()
        
        try:
            with open(self.safety_switches_file, 'r') as f:
                self.safety_switches = json.load(f)
        except FileNotFoundError:
            self.safety_switches = self.create_default_safety_switches()
            self.save_safety_switches()
    
    def create_default_rate_limits(self):
        """Create default rate limits configuration"""
        now = datetime.now()
        return {
            "window_start": now.isoformat(),
            "counters": {
                "tier1_append": 0,
                "tier2_parameter": 0,
                "tier3_content": 0,
                "tier4_structural": 0
            },
            "limits": {
                "tier1_append": {"daily": 5, "weekly": None},
                "tier2_parameter": {"daily": None, "weekly": 2},
                "tier3_content": {"daily": None, "weekly": 1},
                "tier4_structural": {"daily": 0, "weekly": 0}
            },
            "applied_today": [],
            "applied_this_week": [],
            "last_reset_daily": now.isoformat(),
            "last_reset_weekly": now.isoformat()
        }
    
    def create_default_safety_switches(self):
        """Create default safety switches"""
        return {
            "AI_SELF_IMPROVEMENT": {"enabled": False, "description": "Master on/off switch"},
            "AUTO_APPLY_CHANGES": {"enabled": False, "description": "Allow automatic application"},
            "ALLOW_TIER_1_AUTO": {"enabled": False, "description": "Auto-apply Tier 1 after timeout"},
            "ALLOW_SOUL_EDIT": {"enabled": False, "description": "Permit SOUL.md changes"},
            "ALLOW_AGENTS_EDIT": {"enabled": False, "description": "Permit AGENTS.md changes"},
            "REQUIRE_BACKUP": {"enabled": True, "description": "Require backup before changes"},
            "REQUIRE_VALIDATION": {"enabled": True, "description": "Require validation"},
            "ENABLE_KILL_SWITCH_VOTES": {"enabled": True, "description": "User can disable"},
            "DANGEROUS_PATTERN_DETECTION": {"enabled": True, "description": "Pattern detection"},
            "EMERGENCY_STOP_AVAILABLE": {"enabled": True, "description": "Emergency stop available"}
        }
    
    def save_state(self):
        """Save rate limits state"""
        with open(self.rate_limits_file, 'w') as f:
            json.dump(self.rate_limits, f, indent=2)
    
    def save_safety_switches(self):
        """Save safety switches state"""
        with open(self.safety_switches_file, 'w') as f:
            json.dump(self.safety_switches, f, indent=2)
    
    def check_daily_reset(self):
        """Check if daily counters need reset"""
        now = datetime.now()
        last_reset = datetime.fromisoformat(self.rate_limits["last_reset_daily"])
        
        if now.date() > last_reset.date():
            # Reset daily counters
            self.rate_limits["counters"]["tier1_append"] = 0
            self.rate_limits["applied_today"] = []
            self.rate_limits["last_reset_daily"] = now.isoformat()
            return True
        return False
    
    def check_weekly_reset(self):
        """Check if weekly counters need reset"""
        now = datetime.now()
        last_reset = datetime.fromisoformat(self.rate_limits["last_reset_weekly"])
        
        # Reset on Monday (weekday 0)
        if now.date() > last_reset.date() and now.weekday() == 0:
            # Reset weekly counters
            self.rate_limits["counters"]["tier2_parameter"] = 0
            self.rate_limits["counters"]["tier3_content"] = 0
            self.rate_limits["applied_this_week"] = []
            self.rate_limits["last_reset_weekly"] = now.isoformat()
            return True
        return False
    
    def is_system_enabled(self) -> bool:
        """Check if self-improvement system is enabled"""
        return self.safety_switches.get("AI_SELF_IMPROVEMENT", {}).get("enabled", False)
    
    def check_rate_limit(self, tier: str, operation: str) -> Tuple[bool, Optional[str]]:
        """Check if operation is within rate limits"""
        if not self.is_system_enabled():
            return False, "Self-improvement system is disabled"
        
        # Check for emergency stop
        if not self.safety_switches.get("EMERGENCY_STOP_AVAILABLE", {}).get("enabled", True):
            return False, "Emergency stop activated"
        
        self.check_daily_reset()
        self.check_weekly_reset()
        
        limits = self.rate_limits["limits"].get(tier, {})
        counter = self.rate_limits["counters"].get(f"{tier}_{operation}", 0)
        
        # Check daily limit
        daily_limit = limits.get("daily")
        if daily_limit is not None and counter >= daily_limit:
            return False, f"Daily limit reached: {counter}/{daily_limit}"
        
        # Check weekly limit
        weekly_limit = limits.get("weekly")
        if weekly_limit is not None and counter >= weekly_limit:
            return False, f"Weekly limit reached: {counter}/{weekly_limit}"
        
        return True, None
    
    def increment_counter(self, tier: str, operation: str, file_path: str, change_id: str):
        """Increment rate limit counter"""
        counter_key = f"{tier}_{operation}"
        self.rate_limits["counters"][counter_key] = self.rate_limits["counters"].get(counter_key, 0) + 1
        
        # Record applied change
        change = {
            "change_id": change_id,
            "tier": tier,
            "operation": operation,
            "file": os.path.basename(file_path),
            "at": datetime.now().isoformat(),
            "hash": self.calculate_file_hash(file_path)
        }
        
        self.rate_limits["applied_today"].append(change)
        self.rate_limits["applied_this_week"].append(change)
        
        self.save_state()
    
    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file"""
        if not os.path.exists(file_path):
            return "file_not_found"
        
        try:
            with open(file_path, 'rb') as f:
                return hashlib.sha256(f.read()).hexdigest()[:16]
        except Exception:
            return "hash_error"
    
    def get_remaining_quota(self, tier: str, operation: str) -> Dict[str, int]:
        """Get remaining quota for tier/operation"""
        self.check_daily_reset()
        self.check_weekly_reset()
        
        limits = self.rate_limits["limits"].get(tier, {})
        counter = self.rate_limits["counters"].get(f"{tier}_{operation}", 0)
        
        result = {}
        
        daily_limit = limits.get("daily")
        if daily_limit is not None:
            result["daily_remaining"] = max(0, daily_limit - counter)
        
        weekly_limit = limits.get("weekly")
        if weekly_limit is not None:
            result["weekly_remaining"] = max(0, weekly_limit - counter)
        
        return result
    
    def get_status(self) -> Dict:
        """Get current rate limiter status"""
        self.check_daily_reset()
        self.check_weekly_reset()
        
        status = {
            "system_enabled": self.is_system_enabled(),
            "switches": {k: v.get("enabled", False) for k, v in self.safety_switches.items()},
            "counters": self.rate_limits["counters"],
            "applied_today_count": len(self.rate_limits["applied_today"]),
            "applied_this_week_count": len(self.rate_limits["applied_this_week"]),
            "last_reset_daily": self.rate_limits["last_reset_daily"],
            "last_reset_weekly": self.rate_limits["last_reset_weekly"]
        }
        
        # Add remaining quotas
        status["remaining_quotas"] = {}
        for tier in ["tier1", "tier2", "tier3", "tier4"]:
            for operation in ["append", "parameter", "content", "structural"]:
                key = f"{tier}_{operation}"
                if key in self.rate_limits["counters"]:
                    status["remaining_quotas"][key] = self.get_remaining_quota(tier, operation)
        
        return status
    
    def emergency_stop(self) -> Dict:
        """Emergency stop - disable system immediately"""
        self.safety_switches["EMERGENCY_STOP_AVAILABLE"]["enabled"] = False
        self.safety_switches["AI_SELF_IMPROVEMENT"]["enabled"] = False
        self.save_safety_switches()
        
        return {
            "action": "emergency_stop",
            "timestamp": datetime.now().isoformat(),
            "system_disabled": True
        }
    
    def pause_system(self, hours: int) -> Dict:
        """Pause system for specified hours"""
        resume_time = (datetime.now() + timedelta(hours=hours)).isoformat()
        
        self.safety_switches["AI_SELF_IMPROVEMENT"]["enabled"] = False
        self.safety_switches["AI_SELF_IMPROVEMENT"]["resume_at"] = resume_time
        self.save_safety_switches()
        
        return {
            "action": "paused",
            "paused_until": resume_time,
            "duration_hours": hours
        }


if __name__ == "__main__":
    # CLI for testing
    import sys
    
    limiter = RateLimiter()
    
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        status = limiter.get_status()
        print(json.dumps(status, indent=2))
    elif len(sys.argv) > 1 and sys.argv[1] == "test":
        # Test rate limiting
        allowed, reason = limiter.check_rate_limit("tier1", "append")
        print(f"Tier1 append allowed: {allowed}")
        print(f"Reason: {reason}")
    else:
        print("Usage: python rate_limiter.py [status|test]")