package com.laec.lab_service.repository;

import com.laec.lab_service.entity.GrupoAula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrupoAulaRepository extends JpaRepository<GrupoAula, Integer> {

    /**
     * Buscar participações de uma aula
     */
    List<GrupoAula> findByAulaPratica_AulaId(Integer aulaId);

    /**
     * Buscar participações de um grupo
     */
    List<GrupoAula> findByGrupo_GrupoId(Integer grupoId);

    /**
     * Buscar grupos de um turno específico
     */
    List<GrupoAula> findByAulaPratica_AulaIdAndTurnoOrderByOrdemExecucao(Integer aulaId, Integer turno);

    /**
     * Verificar se grupo já está na aula
     */
    boolean existsByAulaPratica_AulaIdAndGrupo_GrupoId(Integer aulaId, Integer grupoId);

    /**
     * Contar presenças de um grupo
     */
    @Query("SELECT COUNT(ga) FROM GrupoAula ga WHERE ga.grupo.grupoId = :grupoId AND ga.presente = true")
    Long countPresencasByGrupo(@Param("grupoId") Integer grupoId);

    /**
     * Contar faltas de um grupo
     */
    @Query("SELECT COUNT(ga) FROM GrupoAula ga WHERE ga.grupo.grupoId = :grupoId AND ga.presente = false")
    Long countFaltasByGrupo(@Param("grupoId") Integer grupoId);
}
