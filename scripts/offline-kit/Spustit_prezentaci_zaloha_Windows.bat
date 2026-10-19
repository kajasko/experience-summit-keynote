@echo off
rem ZALOHA. Hlavni zpusob: dvojklik na Prezentace_Experience_Summit.html (nepotrebuje server).
rem Tento soubor spusti lokalni server se spravnymi MIME typy (Python, jinak PowerShell).
cd /d "%~dp0"
if not exist "%~dp0Keynote_offline\index.html" (
  echo Slozka Keynote_offline nenalezena. Nejdriv ZIP rozbalte: pravy klik, Extrahovat vse.
  pause
  exit /b 1
)
py -3 -c "import sys" >nul 2>&1 && (py -3 "%~dp0keynote_server.py" & goto :end)
python -c "import sys; sys.exit(0 if sys.version_info[0]==3 else 1)" >nul 2>&1 && (python "%~dp0keynote_server.py" & goto :end)
echo Python nenalezen, spoustim server v PowerShellu...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0keynote-server.ps1"
:end
pause
