-- =====================================================
-- Script para garantir username NOT NULL com valores
-- LAEC - Laboratório de Análise Experimental do Comportamento
-- =====================================================

-- Popular username para usuários que não têm (usando email)
UPDATE usuarios 
SET username = LOWER(SPLIT_PART(email, '@', 1))
WHERE username IS NULL;

-- Garantir que username seja NOT NULL
ALTER TABLE usuarios 
ALTER COLUMN username SET NOT NULL;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
