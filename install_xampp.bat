@echo off
REM ============================================================
REM   KEYCE KIAI - INSTALLATION AUTOMATIQUE XAMPP
REM   Ce script copie les fichiers au bon endroit dans XAMPP
REM ============================================================

chcp 65001 > nul
echo.
echo =========================================
echo   Installation KEYCE KIAI pour XAMPP
echo =========================================
echo.

REM Vérifier que les fichiers source existent
if NOT exist "index.html" (
    echo ❌ ERREUR: Ce script doit être exécuté DANS le dossier Keyce-KIAI!
    echo.
    echo Instructions:
    echo 1. Ouvrez l'Explorateur (Win+E)
    echo 2. Allez dans: C:\Users\HP\Desktop\Keyce-KIAI\
    echo 3. Clic droit sur ce fichier (install_xampp.bat)
    echo 4. Cliquez sur "Exécuter"
    echo.
    pause
    exit /b 1
)

REM Vérifier que XAMPP existe
if NOT exist "C:\xampp\htdocs" (
    echo ❌ ERREUR: XAMPP n'a pas été trouvé!
    echo.
    echo Installation requise:
    echo   - Téléchargez XAMPP depuis: https://www.apachefriends.org/
    echo   - Installez-le dans C:\xampp\
    echo.
    pause
    exit /b 1
)

set XAMPP_PATH=C:\xampp\htdocs
set TARGET_PATH=%XAMPP_PATH%\Keyce-KIAI

echo ✓ XAMPP trouvé: %XAMPP_PATH%
echo ✓ Destination: %TARGET_PATH%
echo.

REM Demander confirmation
set /p CONFIRM="Continuer l'installation? (O/N): "
if /i not "%CONFIRM%"=="O" (
    echo Annulé.
    exit /b 0
)

REM Créer le dossier de destination
echo.
echo ⏳ Création du dossier...
if exist "%TARGET_PATH%" (
    echo ⏳ Dossier existant trouvé. Suppression...
    rmdir /s /q "%TARGET_PATH%"
)
mkdir "%TARGET_PATH%"

REM Copier les fichiers
echo ⏳ Copie des fichiers en cours...
xcopy /E /I /Y "assets" "%TARGET_PATH%\assets" >nul 2>&1
xcopy /E /I /Y "db" "%TARGET_PATH%\db" >nul 2>&1
copy /Y "*.php" "%TARGET_PATH%\" >nul 2>&1
copy /Y "*.html" "%TARGET_PATH%\" >nul 2>&1
copy /Y "*.md" "%TARGET_PATH%\" >nul 2>&1
copy /Y "*.txt" "%TARGET_PATH%\" >nul 2>&1
copy /Y "*.bat" "%TARGET_PATH%\" >nul 2>&1

echo.
echo =========================================
echo   ✓ Installation réussie!
echo =========================================
echo.
echo Les fichiers sont maintenant dans:
echo   %TARGET_PATH%
echo.
echo 📋 Prochaines étapes:
echo.
echo 1. Démarrez XAMPP:
echo    - Ouvrez: XAMPP Control Panel
echo    - Cliquez "Start" pour Apache et MySQL
echo    - Attendez qu'ils deviennent verts
echo.
echo 2. Testez la configuration:
echo    Allez à: http://localhost/Keyce-KIAI/diagnostic_xampp.php
echo.
echo 3. Importez la base de données:
echo    Allez à: http://localhost/phpmyadmin
echo    Cliquez "Importer"
echo    Selectionnez: db/membres_du_groupe.sql
echo    Cliquez "Exécuter"
echo.
echo 4. Utilisez l'application:
echo    Allez à: http://localhost/Keyce-KIAI/
echo.
echo 📖 Pour plus d'aide, ouvrez: GUIDE_XAMPP.md
echo.
pause
