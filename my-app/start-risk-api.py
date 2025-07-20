#!/usr/bin/env python3
"""
Script to start the FastAPI server for the risk prediction model
"""

import subprocess
import sys
import os

def start_risk_api():
    """Start the FastAPI server for risk prediction"""
    try:
        # Change to the model2_income_risk directory
        os.chdir('model2_income_risk')
        
        # Check if required packages are installed
        try:
            import fastapi
            import uvicorn
        except ImportError:
            print("Installing required packages...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'fastapi', 'uvicorn'])
        
        print("Starting Risk Prediction API server...")
        print("Server will be available at: http://localhost:8000")
        print("Press Ctrl+C to stop the server")
        
        # Start the FastAPI server
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'main:app', 
            '--host', '0.0.0.0', 
            '--port', '8000',
            '--reload'
        ])
        
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")
        print("Make sure you're in the correct directory and all dependencies are installed.")

if __name__ == "__main__":
    start_risk_api() 