package com.laec.lab_service.repository;

import com.laec.lab_service.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Integer> {

    /**
     * Buscar grupos por turma
     */
    List<Grupo> findByTurma_TurmaIdAndAtivoTrue(Integer turmaId);

    /**
     * Buscar todos os grupos de uma turma (incluindo inativos)
     */
    List<Grupo> findByTurma_TurmaId(Integer turmaId);

    /**
     * Buscar grupos ordenados por prioridade (para determinar ordem de participação)
     * Ordena por última posição DESC (quem foi último vira primeiro) e depois por número do grupo
     */
    @Query("SELECT g FROM Grupo g WHERE g.turma.turmaId = :turmaId AND g.ativo = true " +
           "ORDER BY g.ultimaPosicao DESC, g.numeroGrupo ASC")
    List<Grupo> findByTurmaOrderByPrioridade(@Param("turmaId") Integer turmaId);

    /**
     * Buscar grupo específico de uma turma
     */
    Optional<Grupo> findByTurma_TurmaIdAndNumeroGrupo(Integer turmaId, Integer numeroGrupo);

    /**
     * Verificar se existe grupo com o número na turma
     */
    boolean existsByTurma_TurmaIdAndNumeroGrupo(Integer turmaId, Integer numeroGrupo);

    /**
     * Contar grupos ativos de uma turma
     */
    @Query("SELECT COUNT(g) FROM Grupo g WHERE g.turma.turmaId = :turmaId AND g.ativo = true")
    Long countAtivosByTurma(@Param("turmaId") Integer turmaId);
}
