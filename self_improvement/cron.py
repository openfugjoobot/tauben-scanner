#!/usr/bin/env python3
"""
Cron Jobs for Self-Improvement System
Handles scheduled analysis, reporting, and archival tasks
"""

import json
import os
import sys
import subprocess
import shutil
from datetime import datetime, timedelta
from pathlib import Path
import gzip
import tarfile

class SelfImprovementCron:
    def __init__(self, workspace_dir: str = None):
        if workspace_dir is None:
            workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        self.workspace_dir = workspace_dir
        self.session_logs_dir = os.path.join(workspace_dir, "session_logs")
        self.insights_dir = os.path.join(workspace_dir, "self_improvement", "insights")
        self.decisions_dir = os.path.join(workspace_dir, "self_improvement", "decisions")
        self.proposals_dir = os.path.join(workspace_dir, "self_improvement", "proposals")
        
        # Log file for cron operations
        self.cron_log = os.path.join(workspace_dir, "self_improvement", "cron_log.txt")
    
    def log(self, message: str):
        """Log cron operation"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        print(log_entry)
        
        with open(self.cron_log, 'a') as f:
            f.write(log_entry + '\n')
    
    def check_system_enabled(self) -> bool:
        """Check if self-improvement system is enabled"""
        safety_switches_file = os.path.join(self.workspace_dir, "self_improvement", "safety_switches.json")
        try:
            with open(safety_switches_file, 'r') as f:
                switches = json.load(f)
            return switches.get("AI_SELF_IMPROVEMENT", {}).get("enabled", False)
        except:
            return False
    
    def daily_analysis(self) -> dict:
        """Daily analysis at 23:00 - analyze session logs"""
        self.log("Starting daily analysis...")
        
        if not self.check_system_enabled():
            self.log("System disabled - skipping daily analysis")
            return {"status": "skipped", "reason": "system_disabled"}
        
        # Find session logs from last 24 hours
        cutoff_time = datetime.now() - timedelta(hours=24)
        session_count = 0
        insights_file = None
        
        # Process session logs
        log_date = datetime.now().strftime("%Y-%m-%d")
        insights_file = os.path.join(self.insights_dir, "daily", f"{log_date}.json")
        
        # Create daily insights directory
        os.makedirs(os.path.dirname(insights_file), exist_ok=True)
        
        # In a real implementation, this would:
        # 1. Parse JSON session logs from last 24 hours
        # 2. Extract patterns and trends
        # 3. Generate insights report
        # 4. Create improvement proposals
        
        insights = {
            "analysis_date": log_date,
            "generated_at": datetime.now().isoformat(),
            "sessions_analyzed": 0,
            "total_duration_minutes": 0,
            "tools_used": {},
            "success_patterns": [],
            "failure_patterns": [],
            "suggestions": []
        }
        
        try:
            # Look for session logs in date-based directories
            yesterday = datetime.now() - timedelta(days=1)
            yesterday_str = yesterday.strftime("%Y-%m-%d")
            log_dir = os.path.join(self.session_logs_dir, yesterday.strftime("%Y-%m"), yesterday_str)
            
            if os.path.exists(log_dir):
                log_files = list(Path(log_dir).glob("session_*.json"))
                session_count = len(log_files)
                
                insights["sessions_analyzed"] = session_count
                
                # Basic analysis (would be enhanced in full implementation)
                for log_file in log_files:
                    try:
                        with open(log_file, 'r') as f:
                            session_data = json.load(f)
                            
                        # Extract basic metrics
                        insights["total_duration_minutes"] += session_data.get("duration_seconds", 0) // 60
                        
                        # Count tool usage
                        for message in session_data.get("messages", []):
                            if message.get("role") == "assistant":
                                tools = message.get("tools_used", [])
                                for tool in tools:
                                    insights["tools_used"][tool] = insights["tools_used"].get(tool, 0) + 1
                                    
                    except Exception as e:
                        self.log(f"Error processing session file {log_file}: {e}")
            
            # Generate sample insights
            if session_count > 0:
                insights["success_patterns"] = [
                    "Sessions with clear tool usage show higher completion rates",
                    "Most successful sessions occur during business hours"
                ]
                
                insights["suggestions"] = [
                    {
                        "target_file": "WORKFLOW.md",
                        "change_type": "append",
                        "description": "Add section on optimal scheduling for complex tasks",
                        "confidence": 0.7,
                        "tier": 2
                    }
                ]
            
            # Save insights
            with open(insights_file, 'w') as f:
                json.dump(insights, f, indent=2)
            
            self.log(f"Daily analysis completed: {session_count} sessions analyzed")
            
        except Exception as e:
            self.log(f"Error in daily analysis: {e}")
            return {"status": "error", "error": str(e)}
        
        return {
            "status": "success",
            "sessions_analyzed": session_count,
            "insights_file": insights_file
        }
    
    def weekly_report(self) -> dict:
        """Weekly report at Sunday 08:00 - comprehensive analysis"""
        self.log("Starting weekly report...")
        
        if not self.check_system_enabled():
            self.log("System disabled - skipping weekly report")
            return {"status": "skipped", "reason": "system_disabled"}
        
        # Find latest daily analyses for the week
        week_number = datetime.now().isocalendar().week
        year = datetime.now().year
        
        report_file = os.path.join(self.insights_dir, "weekly", f"{year}-W{week_number:02d}.json")
        
        weekly_report = {
            "report_date": datetime.now().strftime("%Y-%m-%d"),
            "week_number": week_number,
            "year": year,
            "generated_at": datetime.now().isoformat(),
            "period": {
                "from": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
                "to": datetime.now().strftime("%Y-%m-%d")
            },
            "summary": {
                "total_sessions": 0,
                "total_duration_hours": 0,
                "most_used_tools": {},
                "success_rate": 0,
                "issues_found": []
            },
            "improvements_applied": [],
            "recommendations": []
        }
        
        try:
            # Collect daily insights from the past week
            daily_insights = []
            for i in range(7):
                date = datetime.now() - timedelta(days=i)
                insights_file = os.path.join(self.insights_dir, "daily", f"{date.strftime('%Y-%m-%d')}.json")
                
                if os.path.exists(insights_file):
                    with open(insights_file, 'r') as f:
                        insights = json.load(f)
                    daily_insights.append(insights)
            
            # Aggregate data
            total_sessions = sum(d.get("sessions_analyzed", 0) for d in daily_insights)
            total_duration = sum(d.get("total_duration_minutes", 0) for d in daily_insights)
            
            weekly_report["summary"]["total_sessions"] = total_sessions
            weekly_report["summary"]["total_duration_hours"] = round(total_duration / 60, 1)
            
            # Aggregate tool usage
            all_tools = {}
            for insights in daily_insights:
                tools = insights.get("tools_used", {})
                for tool, count in tools.items():
                    all_tools[tool] = all_tools.get(tool, 0) + count
            
            # Sort tools by usage
            sorted_tools = sorted(all_tools.items(), key=lambda x: x[1], reverse=True)
            weekly_report["summary"]["most_used_tools"] = dict(sorted_tools[:5])
            
            # Generate recommendations
            if total_sessions > 0:
                weekly_report["recommendations"] = [
                    {
                        "priority": "high",
                        "description": "Optimize tool selection workflow for frequently used tools",
                        "expected_impact": "15% faster completion time"
                    },
                    {
                        "priority": "medium", 
                        "description": "Add more context preservation between sessions",
                        "expected_impact": "10% reduction in repeated questions"
                    }
                ]
            
            # Save weekly report
            with open(report_file, 'w') as f:
                json.dump(weekly_report, f, indent=2)
            
            self.log(f"Weekly report completed: {total_sessions} sessions this week")
            
        except Exception as e:
            self.log(f"Error in weekly report: {e}")
            return {"status": "error", "error": str(e)}
        
        return {
            "status": "success",
            "week_number": week_number,
            "report_file": report_file
        }
    
    def monthly_archive(self) -> dict:
        """Monthly archive on 1st of month - compress old logs"""
        self.log("Starting monthly archive...")
        
        if not self.check_system_enabled():
            self.log("System disabled - skipping monthly archive")
            return {"status": "skipped", "reason": "system_disabled"}
        
        # Archive session logs older than 30 days
        cutoff_date = datetime.now() - timedelta(days=30)
        archive_dir = os.path.join(self.session_logs_dir, "archive")
        os.makedirs(archive_dir, exist_ok=True)
        
        archived_files = 0
        archive_size = 0
        
        try:
            for root, dirs, files in os.walk(self.session_logs_dir):
                # Skip archive directory
                if "archive" in root:
                    continue
                
                for file in files:
                    if file.endswith('.json'):
                        file_path = os.path.join(root, file)
                        file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                        
                        if file_time < cutoff_date:
                            # Create archive entry relative to session_logs
                            rel_path = os.path.relpath(file_path, self.session_logs_dir)
                            archive_file = os.path.join(archive_dir, f"{rel_path}.gz")
                            
                            # Ensure archive directory exists
                            os.makedirs(os.path.dirname(archive_file), exist_ok=True)
                            
                            # Compress the file
                            with open(file_path, 'rb') as f_in:
                                with gzip.open(archive_file, 'wb') as f_out:
                                    shutil.copyfileobj(f_in, f_out)
                            
                            # Remove original file
                            os.remove(file_path)
                            
                            archived_files += 1
                            archive_size += os.path.getsize(archive_file)
            
            # Clean up empty directories
            for root, dirs, files in os.walk(self.session_logs_dir, topdown=False):
                if "archive" in root:
                    continue
                if not files and not dirs:
                    try:
                        os.rmdir(root)
                    except:
                        pass  # Directory might not be empty
            
            self.log(f"Monthly archive completed: {archived_files} files archived ({archive_size/1024/1024:.1f} MB)")
            
        except Exception as e:
            self.log(f"Error in monthly archive: {e}")
            return {"status": "error", "error": str(e)}
        
        return {
            "status": "success",
            "files_archived": archived_files,
            "archive_size_mb": round(archive_size / 1024 / 1024, 1)
        }
    
    def analyze_now(self) -> dict:
        """Manual trigger - run analysis immediately"""
        self.log("Manual analysis triggered...")
        
        # Run daily analysis manually
        daily_result = self.daily_analysis()
        
        return {
            "trigger_type": "manual",
            "timestamp": datetime.now().isoformat(),
            "daily_analysis": daily_result
        }


def main():
    """Command line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Self-Improvement Cron Jobs")
    parser.add_argument("action", choices=["daily", "weekly", "monthly", "analyze"], 
                       help="Action to perform")
    parser.add_argument("--workspace", help="Workspace directory path")
    
    args = parser.parse_args()
    
    cron = SelfImprovementCron(args.workspace)
    
    if args.action == "daily":
        result = cron.daily_analysis()
    elif args.action == "weekly":
        result = cron.weekly_report()
    elif args.action == "monthly":
        result = cron.monthly_archive()
    elif args.action == "analyze":
        result = cron.analyze_now()
    
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()