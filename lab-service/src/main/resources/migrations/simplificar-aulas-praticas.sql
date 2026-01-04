-- Script para simplificar estrutura de aulas práticas
-- Remove campo status - aulas são sempre cadastradas como realizadas

ALTER TABLE aulas_praticas DROP COLUMN IF EXISTS status;

-- Comentário explicativo
COMMENT ON TABLE aulas_praticas IS 'Registros de aulas práticas já realizadas. Cada cadastro representa uma aula que já aconteceu.';
