-- Adicionar colunas de contadores de turno
ALTER TABLE grupos 
ADD COLUMN IF NOT EXISTS total_primeiro_turno INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_segundo_turno INTEGER DEFAULT 0;

-- Atualizar grupos existentes
UPDATE grupos 
SET total_primeiro_turno = 0,
    total_segundo_turno = 0
WHERE total_primeiro_turno IS NULL OR total_segundo_turno IS NULL;

-- Verificar resultado
SELECT grupo_id, numero_grupo, nome_grupo, total_primeiro_turno, total_segundo_turno 
FROM grupos 
LIMIT 5;
