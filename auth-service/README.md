# Auth Service - LAEC

Serviço de autenticação para o sistema LAEC (Laboratório de Análises Clínicas).

## 🚀 Como Executar

### Pré-requisitos
- **Java 17** instalado
- **PostgreSQL** rodando localmente
- **Database** `laec` criado com as tabelas necessárias

### ⚙️ Configuração Inicial (OBRIGATÓRIO)

**Antes de executar o serviço pela primeira vez, você precisa configurar as variáveis de ambiente:**

1. **Copie o arquivo de exemplo:**
   ```powershell
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

2. **Configure as variáveis de ambiente ou edite o arquivo `application.properties` com suas credenciais:**
   - `DB_PASSWORD`: Senha do PostgreSQL
   - `JWT_SECRET`: Chave secreta para JWT (mínimo 256 bits)
   
3. **OU crie um arquivo `.env` baseado no `.env.example`:**
   ```powershell
   cp .env.example .env
   ```
   E edite com suas configurações reais.

4. **Gere uma chave JWT segura:**
   ```bash
   openssl rand -base64 32
   ```

> ⚠️ **IMPORTANTE**: Nunca commite o arquivo `application.properties` ou `.env` com credenciais reais!

### Opção 1: Executar via PowerShell (Recomendado)

1. Abra o **PowerShell** (não o terminal do VS Code)
2. Navegue até a pasta do projeto:
   ```powershell
   cd C:\dev\pessoal\auth-service
   ```
3. Execute o script:
   ```powershell
   .\start-service.ps1
   ```
4. O serviço estará disponível em: **http://localhost:8081**

### Opção 2: Executar via comando direto

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
java -jar .\target\auth-service-0.0.1-SNAPSHOT.jar
```

### Opção 3: Recompilar e executar

Se você fez alterações no código:

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
.\mvnw.cmd clean package -DskipTests -s .mvn\settings.xml
java -jar .\target\auth-service-0.0.1-SNAPSHOT.jar
```

## 📡 Endpoints Disponíveis

### POST /api/auth/login
Realiza login de usuário existente.

**Request:**
```json
{
  "email": "admin@laec.com",
  "senha": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "admin",
  "nome": "Admin LAEC",
  "id": "uuid-do-usuario",
  "email": "admin@laec.com"
}
```

### POST /api/auth/register
Cadastra novo usuário.

**Request:**
```json
{
  "nome": "Novo Usuário",
  "email": "usuario@laec.com",
  "senha": "senha123",
  "tipo": "aluno",
  "curso": "Análises Clínicas",
  "periodo": "3º",
  "telefone": "(62) 99999-9999"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "aluno",
  "nome": "Novo Usuário",
  "id": "uuid-do-usuario",
  "email": "usuario@laec.com"
}
```

## 🧪 Testando os Endpoints

### Com curl (Git Bash):
```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laec.com","senha":"admin123"}'

# Registro
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test User","email":"test@laec.com","senha":"test123","tipo":"aluno"}'
```

### Com PowerShell:
```powershell
# Login
Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@laec.com","senha":"admin123"}'
```

## 🔧 Configurações

### application.properties
- **Porta**: 8081
- **Database**: jdbc:postgresql://localhost:5432/laec
- **Usuário PostgreSQL**: postgres
- **Senha PostgreSQL**: 3003
- **JWT Secret**: laec-secret-key-2025-super-secure-change-in-production
- **JWT Expiration**: 24 horas (86400000 ms)
- **Eureka**: Desabilitado (`eureka.client.enabled=false`)

## 📦 Usuários de Teste (já cadastrados no banco)

| Email | Senha | Tipo |
|-------|-------|------|
| admin@laec.com | admin123 | admin |
| ueliton@unialfa.com.br | professor123 | professor |
| rafael.brandao@unialfa.com.br | tecnico123 | tecnico |

## 🛠️ Tecnologias

- **Spring Boot** 3.5.9
- **Java** 17
- **PostgreSQL** 17.6
- **JWT** (jjwt 0.12.3)
- **Spring Security** com BCrypt
- **Spring Data JPA** com Hibernate
- **Maven** 3.9.x

## 📝 Notas Importantes

1. **Java 17 é obrigatório** - O projeto não compila com Java 8
2. **Maven Central** - Configurado em `.mvn/settings.xml` para evitar timeout do Nexus corporativo
3. **Senhas BCrypt** - Compatíveis com o PostgreSQL pgcrypto
4. **CORS** - Configurado para aceitar requisições do frontend em `localhost:4200`
5. **Eureka desabilitado** - Para facilitar o desenvolvimento standalone

## 🐛 Troubleshooting

### Erro: "Failed to connect to localhost port 8081"
- Verifique se o serviço está rodando
- Confirme que não há outro serviço usando a porta 8081

### Erro: "FATAL: autenticação do tipo senha falhou"
- Verifique a senha do PostgreSQL em `application.properties`
- Senha atual configurada: `3003`

### Erro: "Cannot find Java 17"
- Verifique se o Java 17 está instalado em: `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot`
- Execute: `java -version` no terminal para confirmar

### Serviço desliga sozinho após iniciar
- Execute o PowerShell **fora do VS Code**
- Use `start-service.ps1` em uma janela dedicada do PowerShell
