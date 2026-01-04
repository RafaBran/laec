-- Script para processar aulas existentes e atualizar contadores/posições dos grupos

-- 1. Resetar contadores e posições (começar do zero)
UPDATE grupos 
SET total_primeiro_turno = 0,
    total_segundo_turno = 0,
    ultima_posicao = NULL;

-- 2. Processar cada aula em ordem cronológica e atualizar contadores
WITH aulas_ordenadas AS (
  SELECT 
    ap.aula_id,
    ap.turma_id,
    ap.data_aula,
    ROW_NUMBER() OVER (PARTITION BY ap.turma_id ORDER BY ap.data_aula) as ordem_aula
  FROM aulas_praticas ap
),
participacoes_com_ordem AS (
  SELECT 
    ga.grupo_id,
    ga.turno,
    ga.presente,
    ao.ordem_aula,
    ao.data_aula
  FROM grupos_aulas ga
  JOIN aulas_ordenadas ao ON ga.aula_id = ao.aula_id
  ORDER BY ao.turma_id, ao.data_aula, ga.turno, ga.grupo_id
)
-- Atualizar contadores com base nas participações
UPDATE grupos g
SET 
  total_primeiro_turno = (
    SELECT COUNT(*) 
    FROM participacoes_com_ordem p
    WHERE p.grupo_id = g.grupo_id 
      AND p.turno = 1 
      AND p.presente = true
  ),
  total_segundo_turno = (
    SELECT COUNT(*) 
    FROM participacoes_com_ordem p
    WHERE p.grupo_id = g.grupo_id 
      AND p.turno = 2 
      AND p.presente = true
  );

-- 3. Inicializar ultima_posicao com base no número do grupo (ordem crescente)
-- Grupos que faltaram na última aula vão para posição 0
WITH ultima_aula_por_turma AS (
  SELECT 
    ap.turma_id,
    MAX(ap.aula_id) as ultima_aula_id
  FROM aulas_praticas ap
  GROUP BY ap.turma_id
),
grupos_que_faltaram AS (
  SELECT DISTINCT ga.grupo_id
  FROM grupos_aulas ga
  JOIN ultima_aula_por_turma uat ON ga.aula_id = uat.ultima_aula_id
  WHERE ga.presente = false
)
UPDATE grupos g
SET ultima_posicao = CASE 
  WHEN g.grupo_id IN (SELECT grupo_id FROM grupos_que_faltaram) THEN 0
  ELSE g.numero_grupo  -- Posição inicial baseada no número do grupo
END
WHERE g.ativo = true;

-- 4. Verificar resultado
SELECT 
  g.grupo_id,
  g.numero_grupo,
  g.nome_grupo,
  g.total_primeiro_turno,
  g.total_segundo_turno,
  g.ultima_posicao,
  t.nome_turma
FROM grupos g
JOIN turmas t ON g.turma_id = t.turma_id
WHERE g.ativo = true
ORDER BY t.turma_id, g.ultima_posicao DESC NULLS LAST, g.numero_grupo;
