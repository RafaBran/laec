-- Adicionar campos de contagem de turnos e ajustar ultima_posicao

-- Adicionar novos campos
ALTER TABLE grupos 
ADD COLUMN IF NOT EXISTS total_primeiro_turno INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_segundo_turno INTEGER DEFAULT 0;

-- Atualizar comentário da coluna ultima_posicao
COMMENT ON COLUMN grupos.ultima_posicao IS 'Posição global do grupo na última aula (1-12). Usado para rodízio: quem foi último será primeiro';

-- Atualizar grupos existentes
UPDATE grupos SET 
    total_primeiro_turno = 0,
    total_segundo_turno = 0
WHERE total_primeiro_turno IS NULL OR total_segundo_turno IS NULL;
