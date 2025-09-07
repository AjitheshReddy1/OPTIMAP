#!/usr/bin/env python3
"""
Setup script for AI Matching functionality
Installs required Python dependencies and initializes the AI model
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up AI Matching for OPT-MAP")
    print("=" * 50)
    
    # Check if Python is available
    if not run_command("python --version", "Checking Python installation"):
        print("❌ Python is not installed or not in PATH")
        print("Please install Python 3.8+ from https://python.org")
        return False
    
    # Install pip if not available
    run_command("python -m ensurepip --upgrade", "Ensuring pip is available")
    
    # Install required packages
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("❌ Failed to install dependencies")
        print("Please check your internet connection and try again")
        return False
    
    # Test the AI matching script
    print("\n🧠 Testing AI model loading...")
    try:
        from ai_matching import AIMatcher
        matcher = AIMatcher()
        print("✅ AI model loaded successfully!")
    except Exception as e:
        print(f"❌ Failed to load AI model: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\nTo start the AI Matching API server, run:")
    print("  python api_server.py")
    print("\nThe API will be available at: http://localhost:5000")
    print("You can then use the AI Matching feature in the React app.")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
