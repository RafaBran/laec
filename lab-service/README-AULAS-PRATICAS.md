# Sistema de Aulas Práticas com Gestão de Prioridade

## 📋 Visão Geral

Sistema completo para gerenciar aulas práticas no laboratório com **controle inteligente de prioridade de grupos**.

## 🎯 Regras de Negócio

### Capacidade do Laboratório
- **Máximo:** 8 grupos simultâneos
- **Média de grupos por turma:** 12 grupos
- **Solução:** Aulas divididas em 2 turnos

### Sistema de Prioridade

#### Ganho de Prioridade (+5 pontos)
- Grupo ficou no **2º turno** na última aula

#### Perda de Prioridade (-10 pontos)
- Grupo **faltou** à aula
- Incrementa contador de faltas

#### Prioridade Neutra (-1 ponto)
- Grupo participou do **1º turno**

### Alocação Automática
1. Grupos ordenados por **pontuação de prioridade** (maior primeiro)
2. Primeiros 8 grupos → 1º turno
3. Grupos restantes → 2º turno
4. Sistema sugere ordem de execução

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

```sql
grupos (
    grupo_id SERIAL PRIMARY KEY,
    turma_id INTEGER FK,
    numero_grupo INTEGER UNIQUE per turma,
    nome_grupo VARCHAR(255),
    prioridade_atual INTEGER DEFAULT 0,
    total_faltas INTEGER DEFAULT 0,
    ultima_posicao INTEGER (1 ou 2),
    ativo BOOLEAN DEFAULT true
)

aulas_praticas (
    aula_id SERIAL PRIMARY KEY,
    turma_id INTEGER FK,
    data_aula DATE NOT NULL,
    numero_aula INTEGER,
    tema VARCHAR(255),
    procedimento VARCHAR(255),
    status VARCHAR(20) -- PLANEJADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
)

grupos_aulas (
    grupo_aula_id SERIAL PRIMARY KEY,
    aula_id INTEGER FK,
    grupo_id INTEGER FK,
    turno INTEGER (1 ou 2),
    ordem_execucao INTEGER (1 a 8),
    presente BOOLEAN DEFAULT true,
    horario_inicio TIMESTAMP,
    horario_fim TIMESTAMP
)
```

## 🚀 Endpoints da API

### Grupos

```http
GET    /api/grupos/turma/{turmaId}              # Listar grupos
GET    /api/grupos/{id}                         # Buscar grupo
GET    /api/grupos/turma/{turmaId}/prioridade   # Ver prioridades
POST   /api/grupos                              # Criar grupo
DELETE /api/grupos/{id}                         # Deletar grupo
```

### Aulas Práticas

```http
GET    /api/aulas/turma/{turmaId}               # Listar aulas
GET    /api/aulas/{id}                          # Buscar aula
POST   /api/aulas                               # Criar aula
POST   /api/aulas/{id}/alocar-grupos            # Alocar grupos automaticamente
PUT    /api/aulas/{id}/concluir                 # Concluir aula (atualiza prioridades)
PUT    /api/aulas/presenca/{grupoAulaId}        # Marcar presença/falta
DELETE /api/aulas/{id}                          # Deletar aula
```

## 📝 Exemplos de Uso

### 1. Criar Grupos para uma Turma

```bash
# Criar 12 grupos para a turma 1
for i in {1..12}; do
  curl -X POST http://localhost:8083/api/grupos \
    -H "Content-Type: application/json" \
    -d '{
      "turmaId": 1,
      "numeroGrupo": '$i',
      "nomeGrupo": "Grupo '$i'"
    }'
done
```

### 2. Ver Prioridade Atual dos Grupos

```bash
curl http://localhost:8083/api/grupos/turma/1/prioridade
```

**Resposta:**
```json
{
  "turmaId": 1,
  "gruposOrdenados": [
    {
      "grupoId": 1,
      "numeroGrupo": 1,
      "nomeGrupo": "Grupo 1",
      "prioridadeAtual": 5,
      "turnoSugerido": 1,
      "ordemSugerida": 1,
      "motivoPrioridade": "Ficou no 2º turno na última aula"
    },
    ...
  ],
  "explicacao": "Aula dividida em 2 turnos: 1º turno com 8 grupos, 2º turno com 4 grupos."
}
```

### 3. Criar Aula Prática

```bash
curl -X POST http://localhost:8083/api/aulas \
  -H "Content-Type: application/json" \
  -d '{
    "turmaId": 1,
    "dataAula": "2026-01-10",
    "numeroAula": 1,
    "tema": "Condicionamento Operante",
    "procedimento": "Modelagem",
    "gruposIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }'
```

**Sistema automaticamente:**
- Ordena grupos por prioridade
- Aloca primeiros 8 no 1º turno
- Aloca restantes no 2º turno

### 4. Alocar Grupos Automaticamente (sem especificar IDs)

```bash
curl -X POST http://localhost:8083/api/aulas/1/alocar-grupos
```

Busca **todos** os grupos ativos da turma e aloca automaticamente.

### 5. Marcar Falta de um Grupo

```bash
# grupoAulaId = 5, presente = false
curl -X PUT "http://localhost:8083/api/aulas/presenca/5?presente=false"
```

### 6. Concluir Aula (Atualiza Prioridades)

```bash
curl -X PUT http://localhost:8083/api/aulas/1/concluir
```

**Sistema automaticamente:**
- Marca aula como CONCLUIDA
- Grupos do 2º turno: +5 prioridade
- Grupos que faltaram: -10 prioridade
- Grupos do 1º turno: -1 prioridade

### 7. Listar Aulas de uma Turma

```bash
curl http://localhost:8083/api/aulas/turma/1
```

**Resposta (cards horizontais):**
```json
[
  {
    "aulaId": 1,
    "turmaId": 1,
    "dataAula": "2026-01-10",
    "numeroAula": 1,
    "tema": "Condicionamento Operante",
    "procedimento": "Modelagem",
    "status": "CONCLUIDA",
    "totalGruposPrimeiroTurno": 8,
    "totalGruposSegundoTurno": 4,
    "gruposParticipantes": [
      {
        "grupoId": 1,
        "numeroGrupo": 1,
        "nomeGrupo": "Grupo 1",
        "turno": 1,
        "ordemExecucao": 1,
        "presente": true
      },
      ...
    ]
  }
]
```

## 🧮 Lógica de Prioridade

### Exemplo Prático

**Situação Inicial (12 grupos, todos com prioridade 0):**
```
Aula 1:
  1º Turno: Grupos 1-8
  2º Turno: Grupos 9-12
```

**Após Aula 1:**
```
Grupos 1-8:  prioridade = -1 (participaram do 1º turno)
Grupos 9-12: prioridade = +5 (participaram do 2º turno)
```

**Aula 2 (ordenação automática por prioridade):**
```
  1º Turno: Grupos 9, 10, 11, 12, 1, 2, 3, 4
  2º Turno: Grupos 5, 6, 7, 8
```

**Se Grupo 3 faltar na Aula 2:**
```
Grupo 3: prioridade = -10, total_faltas = 1
```

**Aula 3:**
```
Grupo 3 vai para o final (menor prioridade)
```

## 📊 Frontend - Componente de Cards

### Estrutura Visual

```
╔══════════════════════════════════════════════════════════╗
║  [10/JAN]  Aula #1 - Condicionamento Operante          ║
║                                                          ║
║  Procedimento: Modelagem                                ║
║  Status: CONCLUÍDA                                      ║
║                                                          ║
║  👥 1º Turno (8 grupos)  |  👥 2º Turno (4 grupos)      ║
║  ✅ Grupos: 1,2,3,4,5,6,7,8  |  ✅ Grupos: 9,10,11,12   ║
║                                                          ║
║  📋 Ver Detalhes    ⚙️ Editar    🗑️ Remover            ║
╚══════════════════════════════════════════════════════════╝
```

## 🎨 Próximos Passos - Frontend

1. **Criar modelos TypeScript** (aula-pratica.model.ts, grupo.model.ts)
2. **Criar serviços** (aula-pratica.service.ts, grupo.service.ts)
3. **Criar componente de card** (aula-card.component.ts)
4. **Integrar com uso-laboratorio.component.ts**
5. **Adicionar modal para detalhes da aula**
6. **Criar interface para gerenciar presenças**

## 🔒 Segurança e Validações

- ✅ Não permite duas aulas na mesma data para a mesma turma
- ✅ Não permite grupos duplicados na mesma aula
- ✅ Valida número máximo de grupos por turno (8)
- ✅ Calcula prioridades automaticamente
- ✅ Mantém histórico de faltas
- ✅ Transações para garantir consistência

## 📦 Arquivos Criados

### Backend (lab-service)
```
entity/
  ├── Grupo.java
  ├── AulaPratica.java
  └── GrupoAula.java

dto/
  ├── GrupoRequestDTO.java
  ├── GrupoResponseDTO.java
  ├── AulaPraticaRequestDTO.java
  ├── AulaPraticaResponseDTO.java
  └── PrioridadeGruposDTO.java

repository/
  ├── GrupoRepository.java
  ├── AulaPraticaRepository.java
  └── GrupoAulaRepository.java

service/
  ├── GrupoService.java
  └── AulaPraticaService.java

controller/
  ├── GrupoController.java
  └── AulaPraticaController.java

database-aulas-praticas.sql
```

---

**Sistema pronto para uso!** 🎉

Execute o script SQL e teste os endpoints.
