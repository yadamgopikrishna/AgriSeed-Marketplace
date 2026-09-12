import os
import sys
import time
import subprocess
import webbrowser

base = os.path.dirname(os.path.abspath(__file__))
front = os.path.join(base, "frontend")

print("=" * 65)
print("    ?? AgriSeed Direct - Fullstack System Launcher ??")
print("=" * 65)
print("\n[1/2] Starting Flask Backend & Live MongoDB Server on port 5000...")
subprocess.Popen(f'start "AgriSeed Backend" cmd /k "cd /d "{base}" && python app.py"', shell=True)

print("[2/2] Starting Modern React Frontend on port 5173...")
subprocess.Popen(f'start "AgriSeed Frontend" cmd /k "cd /d "{front}" && npm run dev"', shell=True)

print("\n" + "=" * 65)
print(" ? AgriSeed Services are starting!")
print(" ?? Modern React Web App : http://localhost:5173")
print(" ?? Flask Backend & API   : http://localhost:5000")
print(" ?? Database              : MongoDB (agriseed_db)")
print("=" * 65 + "\n")

print("Opening browser in 3 seconds...")
time.sleep(3)
webbrowser.open("http://localhost:5173")
