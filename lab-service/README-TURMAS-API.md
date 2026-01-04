# API de Turmas - Lab Service

## 📋 Visão Geral

API RESTful para gerenciamento de turmas do sistema LAEC (Laboratório de Análise Experimental do Comportamento).

## 🚀 Tecnologias

- Spring Boot 3.3.5
- Spring Data JPA
- PostgreSQL
- Lombok
- Bean Validation

## 📦 Estrutura do Projeto

```
lab-service/
├── controller/
│   └── TurmaController.java       # Endpoints REST
├── service/
│   └── TurmaService.java          # Lógica de negócio
├── repository/
│   └── TurmaRepository.java       # Acesso ao banco
├── entity/
│   └── Turma.java                 # Entidade JPA
├── dto/
│   ├── TurmaRequestDTO.java       # DTO de entrada
│   └── TurmaResponseDTO.java      # DTO de saída
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── DuplicateResourceException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
└── config/
    └── CorsConfig.java            # Configuração CORS
```

## 🔌 Endpoints da API

### Listar Turmas

```http
GET /api/turmas
```

**Query Parameters (opcionais):**
- `ano` (Integer) - Filtrar por ano
- `semestre` (String) - Filtrar por semestre (primeiro, segundo)
- `turno` (String) - Filtrar por turno (matutino, vespertino, noturno)
- `unidade` (String) - Filtrar por unidade (bueno, perimetral)

**Exemplo:**
```bash
curl http://localhost:8083/api/turmas
curl http://localhost:8083/api/turmas?ano=2025&semestre=primeiro
```

**Resposta:**
```json
[
  {
    "turmaId": 1,
    "ano": 2025,
    "semestre": "primeiro",
    "turno": "matutino",
    "unidade": "bueno",
    "diaSemana": "segunda",
    "nomeTurma": "Análise Experimental A",
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-01T10:00:00"
  }
]
```

### Buscar Turma por ID

```http
GET /api/turmas/{id}
```

**Exemplo:**
```bash
curl http://localhost:8083/api/turmas/1
```

### Listar Anos Letivos

```http
GET /api/turmas/anos
```

**Resposta:**
```json
[2025, 2024, 2023]
```

### Contar Turmas por Ano

```http
GET /api/turmas/anos/{ano}/count
```

**Exemplo:**
```bash
curl http://localhost:8083/api/turmas/anos/2025/count
```

**Resposta:**
```json
5
```

### Criar Turma

```http
POST /api/turmas
Content-Type: application/json
```

**Body:**
```json
{
  "ano": 2025,
  "semestre": "primeiro",
  "turno": "matutino",
  "unidade": "bueno",
  "diaSemana": "segunda",
  "nomeTurma": "Análise Experimental A"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:8083/api/turmas \
  -H "Content-Type: application/json" \
  -d '{
    "ano": 2025,
    "semestre": "primeiro",
    "turno": "matutino",
    "unidade": "bueno",
    "diaSemana": "segunda",
    "nomeTurma": "Análise Experimental A"
  }'
```

**Resposta:** 201 Created

### Atualizar Turma

```http
PUT /api/turmas/{id}
Content-Type: application/json
```

**Body:** Mesma estrutura do POST

**Exemplo:**
```bash
curl -X PUT http://localhost:8083/api/turmas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "ano": 2025,
    "semestre": "segundo",
    "turno": "noturno",
    "unidade": "perimetral",
    "diaSemana": "terca",
    "nomeTurma": "Análise Experimental B"
  }'
```

### Deletar Turma

```http
DELETE /api/turmas/{id}
```

**Exemplo:**
```bash
curl -X DELETE http://localhost:8083/api/turmas/1
```

**Resposta:** 204 No Content

## 📊 Valores Aceitos (Enums)

### Semestre
- `primeiro`
- `segundo`

### Turno
- `matutino`
- `vespertino`
- `noturno`

### Unidade
- `bueno`
- `perimetral`

### Dia da Semana
- `segunda`
- `terca`
- `quarta`
- `quinta`
- `sexta`

## ⚠️ Tratamento de Erros

### 404 Not Found
```json
{
  "timestamp": "2025-01-03T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Turma não encontrada com ID: 1",
  "path": "/api/turmas/1"
}
```

### 409 Conflict
```json
{
  "timestamp": "2025-01-03T10:00:00",
  "status": 409,
  "error": "Conflict",
  "message": "Já existe uma turma cadastrada com os mesmos parâmetros",
  "path": "/api/turmas"
}
```

### 400 Bad Request (Validação)
```json
{
  "timestamp": "2025-01-03T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Erro de validação",
  "errors": {
    "ano": "Ano é obrigatório",
    "semestre": "Semestre é obrigatório"
  },
  "path": "/api/turmas"
}
```

## 🔧 Configuração

### application.properties

```properties
# Server
server.port=8083

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/laec
spring.datasource.username=postgres
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

## 🏃 Como Executar

### Pré-requisitos
- Java 17+
- PostgreSQL com a tabela `turmas` criada
- Maven

### Executar

```bash
cd lab-service
./mvnw spring-boot:run
```

Ou no Windows:
```bash
mvnw.cmd spring-boot:run
```

A API estará disponível em: `http://localhost:8083`

## 🧪 Testando a API

### Criar algumas turmas de teste:

```bash
# Turma 1
curl -X POST http://localhost:8083/api/turmas \
  -H "Content-Type: application/json" \
  -d '{
    "ano": 2025,
    "semestre": "primeiro",
    "turno": "matutino",
    "unidade": "bueno",
    "diaSemana": "segunda",
    "nomeTurma": "Análise Experimental A"
  }'

# Turma 2
curl -X POST http://localhost:8083/api/turmas \
  -H "Content-Type: application/json" \
  -d '{
    "ano": 2025,
    "semestre": "primeiro",
    "turno": "noturno",
    "unidade": "perimetral",
    "diaSemana": "terca",
    "nomeTurma": "Análise Experimental B"
  }'
```

### Listar todas:
```bash
curl http://localhost:8083/api/turmas
```

## 📝 Logs

O serviço gera logs detalhados de todas as operações:

```
INFO  - GET /api/turmas - Params: ano=2025, semestre=primeiro, turno=null, unidade=null
INFO  - Buscando turmas com filtros - Ano: 2025, Semestre: primeiro, Turno: null, Unidade: null
INFO  - POST /api/turmas - Body: TurmaRequestDTO(ano=2025, semestre=primeiro, ...)
INFO  - Criando nova turma: TurmaRequestDTO(ano=2025, semestre=primeiro, ...)
INFO  - Turma criada com sucesso. ID: 1
```

## 🔒 Segurança

- CORS configurado para permitir `localhost:4200` (Angular)
- Validação de entrada com Bean Validation
- Tratamento global de exceções
- Logs de auditoria de todas as operações

---

**Desenvolvido para:** Sistema LAEC - Laboratório de Análise Experimental do Comportamento  
**Data:** Janeiro 2026
