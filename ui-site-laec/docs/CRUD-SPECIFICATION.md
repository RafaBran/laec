# Sistema de Gerenciamento LAEC - Especificação Completa

## 📋 Estrutura de Dados e CRUD

### 1. ANOS LETIVOS
**Tabela:** `anos_letivos`
**CRUD:** ✅ Completo (Create, Read, Update, Delete)

**Campos:**
- `id` (auto)
- `ano` (INTEGER) - Ex: 2024, 2025, 2026
- `descricao` (VARCHAR) - Ex: "Ano Letivo 2025"
- `ativo` (BOOLEAN) - Apenas um ativo por vez
- `created_at`, `updated_at`

**Operações:**
- ✅ Listar anos
- ✅ Criar novo ano
- ✅ Editar ano existente
- ✅ Ativar/Desativar ano
- ✅ Excluir ano (se não tiver semestres vinculados)

---

### 2. SEMESTRES
**Tabela:** `semestres`
**CRUD:** ✅ Completo
**Relação:** Pertence a um Ano Letivo

**Campos:**
- `id` (auto)
- `ano_letivo_id` (FK → anos_letivos)
- `numero` (1 ou 2) - 1º ou 2º Semestre
- `data_inicio` (DATE)
- `data_fim` (DATE)
- `ativo` (BOOLEAN)
- `created_at`, `updated_at`

**Operações:**
- ✅ Listar semestres por ano
- ✅ Criar novo semestre
- ✅ Editar datas e status
- ✅ Ativar/Desativar
- ✅ Excluir (se não tiver turmas vinculadas)

---

### 3. TURMAS
**Tabela:** `turmas`
**CRUD:** ✅ Completo
**Relação:** Pertence a um Semestre

**Campos:**
- `id` (auto)
- `semestre_id` (FK → semestres)
- `nome` (VARCHAR) - Ex: "5º Período - Análise do Comportamento"
- `curso` (VARCHAR) - Ex: "Psicologia"
- `periodo` (VARCHAR) - Ex: "5º Período"
- `turno` (ENUM: manha, tarde, noite)
- `professor_id` (FK → usuarios)
- `horario` (VARCHAR) - Ex: "Terça e Quinta - 08:00 às 10:00"
- `sala` (VARCHAR) - Ex: "Lab LAEC"
- `numero_grupos` (INTEGER) - Quantidade de grupos
- `ativa` (BOOLEAN)
- `created_at`, `updated_at`

**Operações:**
- ✅ Listar turmas por semestre
- ✅ Criar nova turma
- ✅ Editar informações da turma
- ✅ Atribuir professor
- ✅ Definir número de grupos
- ✅ Ativar/Desativar
- ✅ Excluir (se não tiver aulas registradas)

**Ao criar turma:** Sistema cria automaticamente N grupos (conforme `numero_grupos`)

---

### 4. GRUPOS (Auto-gerenciado)
**Tabela:** `grupos`
**CRUD:** ⚙️ Automático (criado junto com turma)

**Campos:**
- `id` (auto)
- `turma_id` (FK → turmas)
- `nome` (VARCHAR) - Ex: "Grupo 1", "Grupo 2"
- `numero` (INTEGER) - Número sequencial
- `descricao` (TEXT)
- `created_at`, `updated_at`

**Operações:**
- ✅ Listar grupos de uma turma
- ✅ Criar grupos automaticamente ao criar turma
- ✅ Adicionar/Remover grupos manualmente (se necessário)
- ⚠️ Grupos vinculados a registros não podem ser excluídos

---

### 5. AULAS PRÁTICAS ⭐ (PRINCIPAL - Registro do Dia)
**Tabela:** `aulas_praticas`
**CRUD:** ✅ Completo
**Relação:** Pertence a uma Turma

**Campos Principais:**
- `id` (auto)
- `turma_id` (FK → turmas)
- `procedimento_id` (FK → procedimentos)
- `data_aula` (DATE) ⭐ **CAMPO PRINCIPAL** - Data do experimento
- `numero_aula` (INTEGER) - Sequencial (1, 2, 3...)
- `tema` (VARCHAR) - Ex: "Introdução ao Condicionamento Operante"
- `observacoes` (TEXT)
- `created_at`, `updated_at`

**Campos Calculados/Relacionados:**
- Lista de grupos que participaram (via `uso_laboratorio`)
- Ordem de execução de cada grupo
- Horários de cada grupo

**Operações:**
- ✅ **Listar** aulas de uma turma
- ✅ **Criar** nova aula prática (registro do dia)
  - Selecionar data
  - Selecionar procedimento
  - Definir tema
  - Selecionar grupos que participaram
  - Definir ordem de execução
  - Adicionar horários (opcional)
  - Observações gerais e por grupo
- ✅ **Editar** aula existente
  - Alterar data
  - Alterar procedimento
  - Alterar grupos/ordem
  - Alterar observações
- ✅ **Visualizar** detalhes completos
- ✅ **Excluir** aula (com confirmação)

---

### 6. USO DO LABORATÓRIO (Relacionamento)
**Tabela:** `uso_laboratorio`
**CRUD:** ⚙️ Gerenciado via Aulas Práticas

**Campos:**
- `id` (auto)
- `aula_pratica_id` (FK → aulas_praticas)
- `grupo_id` (FK → grupos)
- `ordem_execucao` (INTEGER) ⭐ **Quem fez primeiro, segundo, terceiro...**
- `prioridade_proxima_aula` (INTEGER) ⚙️ **Calculado automaticamente**
- `horario_inicio` (TIME)
- `horario_fim` (TIME)
- `observacoes` (TEXT)
- `created_at`, `updated_at`

**Trigger Automático:**
```sql
-- Ao inserir/atualizar uso_laboratorio
-- Calcula prioridade_proxima_aula baseado em ordem_execucao
-- Ordem 1 → Prioridade BAIXA (fará depois na próxima)
-- Ordem N → Prioridade ALTA (fará primeiro na próxima)
```

---

## 🔄 Fluxo de Trabalho Diário

### **Cenário Real: Professor registra aula prática**

```
1. Professor entra no sistema após a aula
2. Vai em "Registrar Uso do Laboratório"
3. Seleciona:
   - Ano: 2025
   - Semestre: 1º Semestre
   - Turma: 5º Período - Análise do Comportamento

4. Preenche dados da aula:
   ✅ Data: 25/12/2025 (hoje)
   ✅ Número da aula: 3 (automático - sequencial)
   ✅ Procedimento: "Caixa de Skinner - Condicionamento Operante"
   ✅ Tema: "Reforço Positivo e Negativo"
   ✅ Observações: "Aula transcorreu normalmente"

5. Sistema sugere ordem dos grupos:
   💡 "Baseado na última aula, sugerimos:"
   - 1º Grupo 4 (fez por último na aula 2)
   - 2º Grupo 5
   - 3º Grupo 6
   - 4º Grupo 1
   - 5º Grupo 2
   - 6º Grupo 3 (fez primeiro na aula 2)

6. Professor pode:
   ✅ Aceitar sugestão
   ✅ OU ajustar manualmente (marcar quem participou + ordem)

7. Adiciona horários (opcional):
   - Grupo 4: 08:00 - 08:40
   - Grupo 5: 08:40 - 09:20
   - Grupo 6: 09:20 - 10:00

8. Clica em "Salvar Registro"

9. Sistema:
   ✅ Cria registro em aulas_praticas
   ✅ Cria registros em uso_laboratorio para cada grupo
   ✅ Trigger calcula prioridades automaticamente
   ✅ Próxima aula (4) já terá sugestão baseada neste registro
```

---

## 🎛️ Módulos do Sistema de Gerenciamento

### **1. Gerenciar Anos e Semestres**
- Tela única com abas
- CRUD completo de anos
- CRUD completo de semestres
- Ativar/Desativar

### **2. Gerenciar Turmas**
- Listar turmas por semestre
- Criar/Editar/Excluir turma
- Atribuir professor
- Definir número de grupos (cria automaticamente)

### **3. ⭐ Registrar Uso do Laboratório** (PRINCIPAL)
- Wizard em 4 etapas
- Sugestão automática de ordem
- Drag & drop de grupos
- Horários e observações
- Salvar registro

### **4. Gerenciar Aulas Práticas**
- Listar todas as aulas de uma turma
- Editar aula existente
- Excluir aula
- Visualizar histórico completo

### **5. Relatórios e Estatísticas**
- Histórico de uso por grupo
- Justiça do revezamento
- Relatório de prioridades
- Exportar dados

---

## 📊 Exemplo de Registro Completo

### **Aula Prática #3**
```json
{
  "id": 3,
  "turma_id": 1,
  "turma_nome": "5º Período - Análise do Comportamento",
  "data_aula": "2025-12-25",
  "numero_aula": 3,
  "procedimento_id": 1,
  "procedimento_titulo": "Caixa de Skinner - Condicionamento Operante",
  "tema": "Reforço Positivo e Negativo",
  "observacoes": "Aula transcorreu normalmente",
  "grupos": [
    {
      "grupo_id": 4,
      "grupo_nome": "Grupo 4",
      "ordem_execucao": 1,
      "horario_inicio": "08:00",
      "horario_fim": "08:40",
      "prioridade_proxima_aula": 6,
      "observacoes": "Grupo demonstrou bom entendimento"
    },
    {
      "grupo_id": 5,
      "grupo_nome": "Grupo 5",
      "ordem_execucao": 2,
      "horario_inicio": "08:40",
      "horario_fim": "09:20",
      "prioridade_proxima_aula": 5,
      "observacoes": null
    },
    {
      "grupo_id": 6,
      "grupo_nome": "Grupo 6",
      "ordem_execucao": 3,
      "horario_inicio": "09:20",
      "horario_fim": "10:00",
      "prioridade_proxima_aula": 4,
      "observacoes": null
    }
  ]
}
```

---

## 🔐 Permissões

| Ação | Admin | Professor | Técnico | Monitor | Aluno |
|------|-------|-----------|---------|---------|-------|
| Gerenciar Anos | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gerenciar Semestres | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gerenciar Turmas | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Registrar Aula Prática** | ✅ | ✅ | ✅ | ❌ | ❌ |
| Editar Aula Prática | ✅ | ✅ (próprias) | ✅ | ❌ | ❌ |
| Excluir Aula Prática | ✅ | ✅ (próprias) | ✅ | ❌ | ❌ |
| Ver Relatórios | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver Uso do Laboratório | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Implementação

**Próximos passos:**
1. ✅ Criar telas de CRUD para Anos/Semestres
2. ✅ Criar tela de CRUD para Turmas
3. ✅ Ajustar "Registrar Aula Prática" (já criado)
4. ✅ Criar tela de edição de aulas existentes
5. ✅ Criar relatórios e estatísticas

**Backend necessário:**
- Endpoints REST para cada tabela
- Implementar funções SQL de prioridade
- Sistema de autenticação JWT com roles

---

**Resumo:** O principal elemento editado diariamente é o **registro de aula prática** (dia de experimento), mas os perfis autorizados têm **CRUD completo** em anos, semestres, turmas e aulas práticas para ter controle total do sistema.
