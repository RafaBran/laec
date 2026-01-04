-- Script de Teste - Aulas Práticas
-- Assumindo que já existe turma_id = 1 cadastrada

-- 1. Criar grupos para a turma (12 grupos)
INSERT INTO grupos (turma_id, numero_grupo, nome_grupo, prioridade_atual, total_faltas, ultima_posicao, ativo) VALUES
(1, 1, 'Grupo Alpha', 0, 0, NULL, true),
(1, 2, 'Grupo Beta', 0, 0, NULL, true),
(1, 3, 'Grupo Gamma', 0, 0, NULL, true),
(1, 4, 'Grupo Delta', 0, 0, NULL, true),
(1, 5, 'Grupo Epsilon', 0, 0, NULL, true),
(1, 6, 'Grupo Zeta', 0, 0, NULL, true),
(1, 7, 'Grupo Eta', 0, 0, NULL, true),
(1, 8, 'Grupo Theta', 0, 0, NULL, true),
(1, 9, 'Grupo Iota', 0, 0, NULL, true),
(1, 10, 'Grupo Kappa', 0, 0, NULL, true),
(1, 11, 'Grupo Lambda', 0, 0, NULL, true),
(1, 12, 'Grupo Mu', 0, 0, NULL, true);

-- 2. Criar primeira aula prática
INSERT INTO aulas_praticas (turma_id, data_aula, numero_aula, tema, procedimento, observacoes, status)
VALUES (1, '2026-01-10', 1, 'Condicionamento Operante', 'Modelagem', 'Primeira aula prática da turma', 'PLANEJADA');

-- 3. Alocar grupos na aula (8 no primeiro turno, 4 no segundo)
-- Primeiro Turno (grupos 1-8)
INSERT INTO grupos_aulas (aula_id, grupo_id, turno, ordem_execucao, presente) VALUES
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 1), 1, 1, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 2), 1, 2, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 3), 1, 3, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 4), 1, 4, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 5), 1, 5, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 6), 1, 6, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 7), 1, 7, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 8), 1, 8, true);

-- Segundo Turno (grupos 9-12)
INSERT INTO grupos_aulas (aula_id, grupo_id, turno, ordem_execucao, presente) VALUES
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 9), 2, 1, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 10), 2, 2, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 11), 2, 3, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 1), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 12), 2, 4, false); -- Grupo 12 faltou

-- 4. Criar segunda aula (já concluída com prioridades atualizadas)
INSERT INTO aulas_praticas (turma_id, data_aula, numero_aula, tema, procedimento, observacoes, status)
VALUES (1, '2026-01-15', 2, 'Treino ao Bebedouro', 'Condicionamento Clássico', 'Segunda aula - grupos reorganizados por prioridade', 'CONCLUIDA');

-- Grupos com prioridade após aula 1:
-- Grupos 9,10,11: ficaram no 2º turno = prioridade +5
-- Grupo 12: faltou = prioridade -10
-- Grupos 1-8: 1º turno = prioridade -1
UPDATE grupos SET prioridade_atual = 5, ultima_posicao = 2 WHERE turma_id = 1 AND numero_grupo IN (9, 10, 11);
UPDATE grupos SET prioridade_atual = -10, ultima_posicao = 2, total_faltas = 1 WHERE turma_id = 1 AND numero_grupo = 12;
UPDATE grupos SET prioridade_atual = -1, ultima_posicao = 1 WHERE turma_id = 1 AND numero_grupo IN (1, 2, 3, 4, 5, 6, 7, 8);

-- Aula 2: Grupos com maior prioridade vão primeiro (9, 10, 11, depois 1-8)
INSERT INTO grupos_aulas (aula_id, grupo_id, turno, ordem_execucao, presente) VALUES
-- Primeiro Turno (prioridade)
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 9), 1, 1, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 10), 1, 2, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 11), 1, 3, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 1), 1, 4, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 2), 1, 5, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 3), 1, 6, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 4), 1, 7, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 5), 1, 8, true),
-- Segundo Turno
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 6), 2, 1, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 7), 2, 2, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 8), 2, 3, true),
((SELECT aula_id FROM aulas_praticas WHERE turma_id = 1 AND numero_aula = 2), 
 (SELECT grupo_id FROM grupos WHERE turma_id = 1 AND numero_grupo = 12), 2, 4, true); -- Grupo 12 voltou

-- 5. Criar terceira aula (próxima - planejada)
INSERT INTO aulas_praticas (turma_id, data_aula, numero_aula, tema, procedimento, observacoes, status)
VALUES (1, '2026-01-17', 3, 'Esquema de Reforçamento', 'Intervalo Fixo', 'Próxima aula planejada', 'PLANEJADA');

-- Verificar resultados
SELECT 'Grupos cadastrados:' as info;
SELECT grupo_id, numero_grupo, nome_grupo, prioridade_atual, total_faltas, ultima_posicao 
FROM grupos WHERE turma_id = 1 ORDER BY numero_grupo;

SELECT 'Aulas criadas:' as info;
SELECT aula_id, data_aula, numero_aula, tema, procedimento, status 
FROM aulas_praticas WHERE turma_id = 1 ORDER BY data_aula;

SELECT 'Participações Aula 1:' as info;
SELECT 
    ap.numero_aula,
    ga.turno,
    ga.ordem_execucao,
    g.numero_grupo,
    g.nome_grupo,
    ga.presente
FROM grupos_aulas ga
JOIN aulas_praticas ap ON ga.aula_id = ap.aula_id
JOIN grupos g ON ga.grupo_id = g.grupo_id
WHERE ap.turma_id = 1 AND ap.numero_aula = 1
ORDER BY ga.turno, ga.ordem_execucao;

SELECT 'Participações Aula 2:' as info;
SELECT 
    ap.numero_aula,
    ga.turno,
    ga.ordem_execucao,
    g.numero_grupo,
    g.nome_grupo,
    ga.presente
FROM grupos_aulas ga
JOIN aulas_praticas ap ON ga.aula_id = ap.aula_id
JOIN grupos g ON ga.grupo_id = g.grupo_id
WHERE ap.turma_id = 1 AND ap.numero_aula = 2
ORDER BY ga.turno, ga.ordem_execucao;

-- Teste de prioridade para próxima aula
SELECT 'Ordem por prioridade (próxima aula):' as info;
SELECT 
    numero_grupo,
    nome_grupo,
    prioridade_atual,
    ultima_posicao,
    total_faltas,
    CASE 
        WHEN prioridade_atual > 0 THEN 'Ficou no 2º turno'
        WHEN prioridade_atual < 0 AND total_faltas > 0 THEN 'Teve falta(s)'
        ELSE 'Prioridade neutra'
    END as motivo_prioridade
FROM grupos 
WHERE turma_id = 1 
ORDER BY prioridade_atual DESC, numero_grupo ASC;
