# Integração da Tabela Turmas com a Tela Uso-Laboratório

## 📋 Visão Geral

Esta documentação explica como a estrutura da tabela `turmas` do PostgreSQL foi integrada dinamicamente com a tela de uso-laboratorio no frontend Angular.

## 🗄️ Estrutura da Tabela

```sql
CREATE TABLE public.turmas (
    turma_id int4 PRIMARY KEY,
    ano int4 NOT NULL,
    semestre varchar(20) NOT NULL CHECK (semestre IN ('primeiro', 'segundo')),
    turno varchar(20) NOT NULL CHECK (turno IN ('matutino', 'vespertino', 'noturno')),
    unidade varchar(20) NOT NULL CHECK (unidade IN ('bueno', 'perimetral')),
    dia_semana varchar(20) NOT NULL CHECK (dia_semana IN ('segunda', 'terca', 'quarta', 'quinta', 'sexta')),
    nome_turma varchar(255),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

## 🏗️ Arquitetura da Solução

### 1. Modelo de Dados (`turma.model.ts`)

O modelo define as interfaces TypeScript que correspondem à estrutura do banco:

```typescript
export interface Turma {
  turma_id: number;
  ano: number;
  semestre: 'primeiro' | 'segundo';
  turno: 'matutino' | 'vespertino' | 'noturno';
  unidade: 'bueno' | 'perimetral';
  dia_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';
  nome_turma: string;
  created_at?: string;
  updated_at?: string;
}
```

**Recursos:**
- Interface `Turma` - espelha a estrutura do banco
- Interface `TurmaDisplay` - dados formatados para exibição
- Classe `TurmaUtils` - funções de formatação e conversão

### 2. Serviço (`turma.service.ts`)

O serviço gerencia todas as operações de API relacionadas a turmas:

**Principais Métodos:**

- `getTurmas()` - Busca todas as turmas
- `getTurmaById(id)` - Busca turma específica
- `getTurmasByAno(ano)` - Filtra por ano
- `getTurmasByAnoSemestre(ano, semestre)` - Filtra por ano e semestre
- `getTurmasAgrupadas()` - Retorna turmas organizadas hierarquicamente
- `getAnosLetivos()` - Lista anos disponíveis
- CRUD completo: `criarTurma()`, `atualizarTurma()`, `deletarTurma()`

### 3. Componente (`uso-laboratorio.component.ts`)

O componente processa os dados e organiza a exibição hierárquica:

**Estrutura Hierárquica:**
```
Anos Letivos (ex: 2024, 2025)
  └─ Semestres (1º Semestre, 2º Semestre)
      └─ Turmas (com informações completas)
```

**Fluxo de Dados:**

1. `carregarAnos()` - Busca turmas do serviço
2. `processarTurmas()` - Organiza em estrutura hierárquica
3. Dados são exibidos no template com navegação expandível

## 🎨 Interface do Usuário

### Sidebar Menu Hierárquico

Exibe a estrutura em três níveis:

```html
- 📅 2025 (Ano Ativo)
  - 📑 1º Semestre
    - 🏛️ Análise Experimental A
      ├─ Matutino - Segunda-feira
      └─ Bueno
```

### Área de Conteúdo

Ao selecionar uma turma, exibe:

- **Cabeçalho:** Nome da turma com badges (Unidade, Turno, Dia)
- **Detalhes:**
  - Código da turma
  - Ano e semestre
  - Unidade
  - Turno
  - Dia da semana
- **Seção de Uso:** Placeholder para dados de uso do laboratório

## 🔄 Mapeamento de Dados

### Do Banco para a UI

```typescript
// Banco de Dados
{
  turma_id: 1,
  ano: 2025,
  semestre: 'primeiro',
  turno: 'matutino',
  unidade: 'bueno',
  dia_semana: 'segunda',
  nome_turma: 'Análise Experimental A'
}

// Interface (após TurmaUtils.converterParaDisplay)
{
  id: 1,
  codigo: 'LAB-2025-1-M',
  nome: 'Análise Experimental A',
  unidade: 'Bueno',
  turno: 'Matutino',
  dia_semana: 'Segunda-feira',
  ano: 2025,
  semestre: '1º Semestre'
}
```

## 🎯 Funcionalidades Implementadas

### ✅ Exibição Dinâmica
- Carrega turmas do banco automaticamente
- Organiza hierarquicamente por ano → semestre → turma
- Expansível/colapsável por nível

### ✅ Formatação Inteligente
- Semestre: `'primeiro'` → `'1º Semestre'`
- Turno: `'matutino'` → `'Matutino'`
- Unidade: `'bueno'` → `'Bueno'`
- Dia: `'segunda'` → `'Segunda-feira'`
- Código: Gerado automaticamente (ex: `LAB-2025-1-M`)

### ✅ Navegação Intuitiva
- Menu lateral colapsável
- Seleção visual de turma ativa
- Badges coloridos para categorias
- Ano atual expandido por padrão

### ✅ Fallback de Dados
- Se API falhar, carrega dados mockados
- Garante que a interface sempre funcione

## 🔌 Endpoints de API Esperados

O serviço espera os seguintes endpoints no backend:

```
GET    /api/turmas              - Lista todas as turmas
GET    /api/turmas/:id          - Busca turma por ID
GET    /api/turmas?ano=2025     - Filtra por ano
GET    /api/turmas?ano=2025&semestre=primeiro - Filtra por ano e semestre
POST   /api/turmas              - Cria nova turma
PUT    /api/turmas/:id          - Atualiza turma
DELETE /api/turmas/:id          - Remove turma
```

## 📦 Arquivos Criados/Modificados

### Criados:
- `src/app/models/turma.model.ts` - Modelos e utilitários
- `src/app/services/turma.service.ts` - Serviço de API

### Modificados:
- `src/app/pages/uso-laboratorio/uso-laboratorio.component.ts` - Lógica de integração
- `src/app/pages/uso-laboratorio/uso-laboratorio.component.html` - Exibição de dia da semana
- `src/app/pages/uso-laboratorio/uso-laboratorio.component.scss` - Estilos para badges

## 🚀 Como Usar

### No Backend (Java/Spring Boot)

1. Criar um controller `TurmaController`:
```java
@RestController
@RequestMapping("/api/turmas")
public class TurmaController {
    
    @GetMapping
    public List<Turma> getTurmas(
        @RequestParam(required = false) Integer ano,
        @RequestParam(required = false) String semestre
    ) {
        // Implementar lógica de busca
    }
}
```

2. Criar entidade `Turma` correspondente à tabela

### No Frontend (Angular)

O frontend já está pronto! Apenas certifique-se de que:

1. O backend esteja rodando e acessível via `/api/turmas`
2. O proxy do Angular esteja configurado corretamente (se necessário)

## 🎨 Personalização

### Alterar Cores dos Badges

No arquivo SCSS:

```scss
&.badge-dia {
  background: #e0e7ff;  // Cor de fundo
  color: #4338ca;       // Cor do texto
}
```

### Modificar Formato do Código

No modelo `TurmaUtils`:

```typescript
static gerarCodigoTurma(turma: Turma): string {
  // Customizar formato aqui
  return `SEU-FORMATO-${turma.ano}`;
}
```

## 🔮 Próximos Passos

1. **Implementar Backend:** Criar endpoints REST no Spring Boot
2. **Dados de Uso:** Integrar tabela `uso_laboratorio`
3. **Filtros:** Adicionar filtros por unidade, turno, etc.
4. **Gráficos:** Visualizar estatísticas de uso
5. **Exportação:** Permitir exportar relatórios

## 💡 Observações

- O componente inclui fallback automático em caso de erro de API
- Ano atual é expandido automaticamente
- Todas as formatações respeitam os constraints do banco
- Código é type-safe com TypeScript
- Design responsivo e acessível

---

**Desenvolvido para:** Sistema LAEC - Laboratório de Análise Experimental do Comportamento
**Data:** Janeiro 2026
