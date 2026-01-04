package com.laec.lab_service.repository;

import com.laec.lab_service.entity.AulaPratica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AulaPraticaRepository extends JpaRepository<AulaPratica, Integer> {

    /**
     * Buscar aulas de uma turma ordenadas por data (mais recente primeiro)
     */
    List<AulaPratica> findByTurma_TurmaIdOrderByDataAulaDesc(Integer turmaId);

    /**
     * Buscar aulas de uma turma por período
     */
    @Query("SELECT a FROM AulaPratica a WHERE a.turma.turmaId = :turmaId " +
           "AND a.dataAula BETWEEN :dataInicio AND :dataFim " +
           "ORDER BY a.dataAula DESC")
    List<AulaPratica> findByTurmaAndPeriodo(
            @Param("turmaId") Integer turmaId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Buscar última aula de uma turma (mais recente por data)
     */
    @Query("SELECT a FROM AulaPratica a WHERE a.turma.turmaId = :turmaId " +
           "ORDER BY a.dataAula DESC LIMIT 1")
    Optional<AulaPratica> findUltimaAulaConcluida(@Param("turmaId") Integer turmaId);

    /**
     * Verificar se existe aula na data para a turma
     */
    boolean existsByTurma_TurmaIdAndDataAula(Integer turmaId, LocalDate dataAula);

    /**
     * Buscar próximas aulas de uma turma (aulas futuras)
     */
    @Query("SELECT a FROM AulaPratica a WHERE a.turma.turmaId = :turmaId " +
           "AND a.dataAula >= CURRENT_DATE " +
           "ORDER BY a.dataAula ASC")
    List<AulaPratica> findProximasAulasPlanejadas(@Param("turmaId") Integer turmaId);
}
