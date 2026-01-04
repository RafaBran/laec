# Script PowerShell para iniciar o auth-service com Java 17
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Usando Java 17 para auth-service" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
java -version
Write-Host ""

# Compilar o JAR se não existir ou estiver desatualizado
if (!(Test-Path ".\target\auth-service-0.0.1-SNAPSHOT.jar")) {
    Write-Host "Compilando auth-service..." -ForegroundColor Yellow
    & .\mvnw.cmd clean package -DskipTests -s .mvn\settings.xml
    Write-Host ""
}

Write-Host "===============================================" -ForegroundColor Green
Write-Host "Iniciando auth-service na porta 8081..." -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar o serviço" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Executar o JAR diretamente
java -jar .\target\auth-service-0.0.1-SNAPSHOT.jar
