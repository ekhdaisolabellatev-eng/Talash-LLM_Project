# TALASH Milestone 3 - Quick Start Guide

## 🚀 FASTEST WAY TO START

### Windows PowerShell
```powershell
cd d:\6th_sem\LLMS\Project\Talash-LLM_Project\milestone_3
.\start.bat
```

### Linux/Mac
```bash
cd d:\6th_sem\LLMS\Project\Talash-LLM_Project\milestone_3
chmod +x start.sh
./start.sh
```

---

## 📋 MANUAL START (Step by Step)

### Step 1: Activate Virtual Environment
```powershell
cd d:\6th_sem\LLMS\Project\Talash-LLM_Project\milestone_3
.\env\Scripts\Activate.ps1
```

Expected output:
```
(env) PS D:\6th_sem\LLMS\Project\Talash-LLM_Project\milestone_3>
```

### Step 2: Start Backend Server
```powershell
python app.py
```

Expected output:
```
╔════════════════════════════════════════════════════════╗
║  TALASH Milestone 3 - Enhanced Backend API Server   ║
║  Flask Application with Authentication & React Support║
╚════════════════════════════════════════════════════════╝

API running on: http://localhost:5000
```

### Step 3: Start Frontend (NEW TERMINAL)
```powershell
cd d:\6th_sem\LLMS\Project\Talash-LLM_Project\milestone_3\frontend
npm install  # Only first time
npm start
```

Expected output:
```
webpack compiled successfully
Compiled successfully!
```

### Step 4: Open Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Step 5: Login
- **Username**: admin
- **Password**: admin123

---

## 📂 PROJECT STRUCTURE

```
milestone_3/
├── env/                    # Virtual environment
│   ├── Scripts/
│   │   ├── Activate.ps1   # Windows activation
│   │   └── activate       # Linux activation
│   └── lib/               # Installed packages
├── app.py                 # Flask backend
├── milestone2.py          # Analysis engine
├── cv_batch_processor.py  # Batch processing
├── requirements.txt       # Dependencies
├── start.bat              # Windows launcher
├── start.sh               # Linux launcher
├── README.md              # Full documentation
├── SETUP_VERIFICATION.md  # Setup checklist
├── frontend/              # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/             # Production build
├── uploads/               # Upload folder
├── outputs/               # Results folder
└── QUICK_START.md         # This file
```

---

## 🔑 MAIN COMMANDS

### Virtual Environment
```bash
# Activate
.\env\Scripts\Activate.ps1

# Deactivate
deactivate

# Check Python
python --version

# Check pip
pip --version
```

### Dependencies
```bash
# Install all
pip install -r requirements.txt

# Install specific
pip install Flask==2.3.3

# List installed
pip list

# Update all
pip install --upgrade -r requirements.txt
```

### Backend
```bash
# Run development
python app.py

# Run production
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Test import
python -c "from app import app; print('OK')"
```

### Frontend
```bash
# Install dependencies
npm install

# Start development
npm start

# Build production
npm run build

# Test build
npm test
```

---

## 📡 API TESTING

### Health Check
```bash
curl http://localhost:5000/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Candidates
```bash
curl http://localhost:5000/api/candidates
```

### Dashboard Stats
```bash
curl http://localhost:5000/api/dashboard-stats
```

---

## 🐛 TROUBLESHOOTING

### Problem: Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
python app.py --port 5001
```

### Problem: Module Not Found
```bash
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

### Problem: Virtual Environment Won't Activate
```bash
# Delete and recreate
rmdir env /s /q
python -m venv env
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problem: npm Modules Not Found
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: Database Connection Error
```bash
# Check if outputs folder exists
mkdir -Force outputs
```

---

## 📊 INSTALLED PACKAGES (26 Total)

```
✓ Flask 2.3.3
✓ Flask-CORS 4.0.0
✓ pdfplumber 0.10.3
✓ python-dotenv 1.0.0
✓ requests 2.31.0
✓ Werkzeug 2.3.7
✓ gunicorn 21.2.0
✓ pdfminer.six 20221105
✓ pypdfium2 5.7.1
✓ Pillow 12.2.0
✓ Jinja2 3.1.6
✓ itsdangerous 2.2.0
✓ click 8.3.3
✓ blinker 1.9.0
✓ MarkupSafe 3.0.3
✓ charset-normalizer 3.4.7
✓ idna 3.13
✓ urllib3 2.6.3
✓ certifi 2026.4.22
✓ colorama 0.4.6
✓ cffi 2.0.0
✓ cryptography 47.0.0
✓ pycparser 3.0
✓ packaging 26.2
✓ setuptools 65.5.0
✓ pip 23.2.1
```

---

## 🎯 FEATURES CHECKLIST

### Milestone 3 ✅
- ✅ Complete React Web App
- ✅ Flask Backend with Auth
- ✅ CV Upload & Processing
- ✅ Candidate Analysis
- ✅ Email System
- ✅ Email Tracking
- ✅ Reporting & Analytics
- ✅ Skill Alignment
- ✅ Dashboard

### Extra Credit ✅
- ✅ Candidate Ranking (0-100)
- ✅ Education Score (30 pts)
- ✅ Experience Score (25 pts)
- ✅ Skills Score (20 pts)
- ✅ Research Score (15 pts)
- ✅ Certifications (5 pts)
- ✅ Missing Info Penalty
- ✅ Comparative Analysis

---

## 📞 SUPPORT

### Environment Status
```bash
# Check Python
python --version

# Check pip packages
pip list

# Check Flask
python -c "import flask; print(flask.__version__)"

# Check backend
python -c "from app import app; print('Backend OK')"
```

### Logs Location
- **Backend**: Console output from `python app.py`
- **Frontend**: Browser console (F12)
- **Errors**: Check terminal for stack traces

---

## 🔄 UPDATING ENVIRONMENT

```bash
# Update pip
python -m pip install --upgrade pip

# Update all packages
pip install --upgrade -r requirements.txt

# Check for updates
pip list --outdated
```

---

## 📝 NOTES

- Virtual environment is isolated from system Python
- Always activate before running commands
- Frontend build is optional (npm serve)
- Backend requires Python 3.9+
- All data stored in memory (can be persistent with DB)
- Email requires SMTP configuration in .env

---

## ✅ READY TO USE!

Environment is **fully configured** and **ready for development**.

**Setup Date**: May 3, 2026  
**Status**: ✅ COMPLETE  
**Python**: 3.11.5  
**Packages**: 26 installed