@echo off
REM Script para executar lab-service com Java 17
REM Não afeta outros projetos ou o sistema

REM Definir JAVA_HOME local para Java 17
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo ===============================================
echo Usando Java 17 para lab-service
echo ===============================================
java -version
echo.
echo ===============================================
echo Iniciando lab-service...
echo ===============================================

REM Executar Maven com Java 17
mvnw.cmd spring-boot:run
