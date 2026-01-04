-- Tabela de Grupos
CREATE TABLE grupos (
    grupo_id SERIAL PRIMARY KEY,
    turma_id INTEGER NOT NULL,
    numero_grupo INTEGER NOT NULL,
    nome_grupo VARCHAR(255),
    prioridade_atual INTEGER DEFAULT 0,
    total_faltas INTEGER DEFAULT 0,
    ultima_posicao INTEGER, -- 1 = primeiro turno, 2 = segundo turno
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grupo_turma FOREIGN KEY (turma_id) REFERENCES turmas(turma_id) ON DELETE CASCADE,
    CONSTRAINT uk_grupo_turma_numero UNIQUE (turma_id, numero_grupo)
);

-- Tabela de Aulas Práticas
CREATE TABLE aulas_praticas (
    aula_id SERIAL PRIMARY KEY,
    turma_id INTEGER NOT NULL,
    data_aula DATE NOT NULL,
    numero_aula INTEGER,
    tema VARCHAR(255),
    procedimento VARCHAR(255),
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'PLANEJADA' CHECK (status IN ('PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aula_turma FOREIGN KEY (turma_id) REFERENCES turmas(turma_id) ON DELETE CASCADE
);

-- Tabela de Participação de Grupos em Aulas
CREATE TABLE grupos_aulas (
    grupo_aula_id SERIAL PRIMARY KEY,
    aula_id INTEGER NOT NULL,
    grupo_id INTEGER NOT NULL,
    turno INTEGER NOT NULL CHECK (turno IN (1, 2)),
    ordem_execucao INTEGER NOT NULL CHECK (ordem_execucao BETWEEN 1 AND 8),
    presente BOOLEAN DEFAULT true,
    horario_inicio TIMESTAMP,
    horario_fim TIMESTAMP,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grupo_aula_aula FOREIGN KEY (aula_id) REFERENCES aulas_praticas(aula_id) ON DELETE CASCADE,
    CONSTRAINT fk_grupo_aula_grupo FOREIGN KEY (grupo_id) REFERENCES grupos(grupo_id) ON DELETE CASCADE,
    CONSTRAINT uk_grupo_aula UNIQUE (aula_id, grupo_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_grupos_turma ON grupos(turma_id);
CREATE INDEX idx_grupos_prioridade ON grupos(prioridade_atual DESC);
CREATE INDEX idx_aulas_turma ON aulas_praticas(turma_id);
CREATE INDEX idx_aulas_data ON aulas_praticas(data_aula);
CREATE INDEX idx_grupos_aulas_aula ON grupos_aulas(aula_id);
CREATE INDEX idx_grupos_aulas_grupo ON grupos_aulas(grupo_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_grupos_updated_at
    BEFORE UPDATE ON grupos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aulas_praticas_updated_at
    BEFORE UPDATE ON aulas_praticas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grupos_aulas_updated_at
    BEFORE UPDATE ON grupos_aulas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE grupos IS 'Grupos de alunos por turma';
COMMENT ON TABLE aulas_praticas IS 'Registro das aulas práticas realizadas';
COMMENT ON TABLE grupos_aulas IS 'Participação de grupos em aulas práticas com controle de turnos';

COMMENT ON COLUMN grupos.prioridade_atual IS 'Pontuação de prioridade - quanto maior, mais prioridade';
COMMENT ON COLUMN grupos.ultima_posicao IS '1 = primeiro turno da última aula, 2 = segundo turno';
COMMENT ON COLUMN grupos_aulas.turno IS '1 = primeiro turno (até 8 grupos), 2 = segundo turno';
COMMENT ON COLUMN grupos_aulas.ordem_execucao IS 'Ordem de execução dentro do turno (1 a 8)';
COMMENT ON COLUMN grupos_aulas.presente IS 'false = grupo faltou à aula';
