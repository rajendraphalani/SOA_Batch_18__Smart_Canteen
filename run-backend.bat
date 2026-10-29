@echo off
title Smart Canteen - Spring Boot Backend (Port 8080)
cd /d "%~dp0backend"
echo ========================================================
echo Starting Smart Canteen Spring Boot Backend on Port 8080...
echo ========================================================
mvn spring-boot:run
pause
