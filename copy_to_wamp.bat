@echo off
REM ============================================================
REM   KEYCE KIAI - SCRIPT D'INSTALLATION WAMP
REM   Ce script copie les fichiers au bon endroit dans WAMP
REM ============================================================

echo.
echo =========================================
echo   Installation KEYCE KIAI pour WAMP
echo =========================================
echo.

REM Checker si les fichiers source existent
if NOT exist "index.html" (
    echo ERREUR: Ce script doit etre execute DANS le dossier Keyce-KIAI!
    echo.
    echo Instructions:
    echo 1. Ouvrez l'Explorateur (Win+E)
    echo 2. Allez dans: C:\Users\HP\Desktop\Keyce-KIAI\
    echo 3. Clic droit sur ce fichier (copy_to_wamp.bat)
    echo 4. Cliquez sur "Executer"
    echo.
    pause
    exit /b 1
)

REM Determiner si WAMP 64-bit ou 32-bit
if exist "C:\wamp64\www" (
    set WAMP_PATH=C:\wamp64\www
    echo Detected: WAMP 64-bit
) else if exist "C:\wamp\www" (
    set WAMP_PATH=C:\wamp\www
    echo Detected: WAMP 32-bit (legacy)
) else (
    echo ERREUR: WAMP n'a pas ete trouve!
    echo.
    echo Vérifiez que WAMP est installe dans:
    echo   - C:\wamp64\www (64-bit) OU
    echo   - C:\wamp\www (32-bit)
    echo.
    pause
    exit /b 1
)

echo.
echo Destination: %WAMP_PATH%
echo.

REM Demander confirmation
setlocal enabledelayedexpansion
set /p CONFIRM="Continuer? (O/N): "
if /i not "%CONFIRM%"=="O" (
    echo Annule.
    exit /b 0
)

REM Creer le dossier de destination
set TARGET_PATH=%WAMP_PATH%\Keyce-KIAI
echo.
echo Creation du dossier: %TARGET_PATH%
if exist "%TARGET_PATH%" (
    echo Le dossier existe deja. Suppression...
    rmdir /s /q "%TARGET_PATH%"
)
mkdir "%TARGET_PATH%"

REM Copie les fichiers
echo Copie des fichiers en cours...
xcopy /E /I /Y "assets" "%TARGET_PATH%\assets"
xcopy /E /I /Y "db" "%TARGET_PATH%\db"
copy /Y "*.php" "%TARGET_PATH%\"
copy /Y "*.html" "%TARGET_PATH%\"
copy /Y "*.md" "%TARGET_PATH%\"
copy /Y "*.txt" "%TARGET_PATH%\"

echo.
echo =========================================
echo   Installation reussie!
echo =========================================
echo.
echo Les fichiers sont maintenant dans:
echo   %TARGET_PATH%
echo.
echo Prochaines etapes:
echo.
echo 1. Demarrez WAMP (icone sur le desktop)
echo    Attendez que tous les services deviennent verts.
echo.
echo 2. Testez la connexion:
echo    Ouvrez: http://localhost/Keyce-KIAI/test_connexion.php
echo.
echo 3. Importez la base de donnees:
echo    Allez a: http://localhost/phpmyadmin
echo    Cliquez sur "Importer"
echo    Selectionnez: db/membres_du_groupe.sql
echo    Cliquez sur "Executer"
echo.
echo 4. Utilisez l'application:
echo    Allez a: http://localhost/Keyce-KIAI/
echo.
echo Pour plus d'aide, lisez:
echo    - QUICK_START.md (demarrage rapide)
echo    - TROUBLESHOOTING.md (diagnostic)
echo.
pause
