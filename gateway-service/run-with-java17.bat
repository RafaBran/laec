@echo off
echo Setting JAVA_HOME to Java 17...
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Java version:
java -version

echo.
echo Compiling and running Gateway Service...
echo.

call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Starting Gateway Service on port 8080...
echo.

java -jar target\gateway-service-0.0.1-SNAPSHOT.jar
