-- Script de exemplo para associar usuários a grupos
-- Execute este script após criar turmas e grupos

-- Exemplo 1: Associar um aluno específico a um grupo
UPDATE usuarios 
SET grupo_id = 1  -- ID do grupo desejado
WHERE id = 10     -- ID do usuário (aluno)
  AND tipo = 'aluno';

-- Exemplo 2: Associar múltiplos alunos ao mesmo grupo
UPDATE usuarios 
SET grupo_id = 1
WHERE id IN (10, 11, 12, 13)
  AND tipo = 'aluno';

-- Exemplo 3: Distribuir alunos entre grupos de uma turma
-- (supondo que você tem 4 grupos na turma_id = 1)
WITH alunos_numerados AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY nome) as num
  FROM usuarios 
  WHERE tipo = 'aluno' 
    AND grupo_id IS NULL
),
grupos_turma AS (
  SELECT 
    grupo_id,
    ROW_NUMBER() OVER (ORDER BY numero_grupo) as num_grupo
  FROM grupos
  WHERE turma_id = 1
)
UPDATE usuarios u
SET grupo_id = (
  SELECT g.grupo_id 
  FROM grupos_turma g
  WHERE g.num_grupo = ((a.num - 1) % (SELECT COUNT(*) FROM grupos_turma)) + 1
)
FROM alunos_numerados a
WHERE u.id = a.id;

-- Verificar associações criadas
SELECT 
  u.id,
  u.nome,
  u.tipo,
  u.grupo_id,
  g.numero_grupo,
  g.nome_grupo,
  t.nome_turma
FROM usuarios u
LEFT JOIN grupos g ON u.grupo_id = g.grupo_id
LEFT JOIN turmas t ON g.turma_id = t.turma_id
WHERE u.tipo = 'aluno'
ORDER BY t.nome_turma, g.numero_grupo, u.nome;

-- Remover associação (caso necessário)
UPDATE usuarios 
SET grupo_id = NULL
WHERE id = 10;
