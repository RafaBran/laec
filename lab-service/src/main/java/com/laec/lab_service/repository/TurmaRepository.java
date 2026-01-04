package com.laec.lab_service.repository;

import com.laec.lab_service.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Integer> {

    /**
     * Buscar turmas por ano
     */
    List<Turma> findByAno(Integer ano);

    /**
     * Buscar turmas por ano e semestre
     */
    List<Turma> findByAnoAndSemestre(Integer ano, Turma.Semestre semestre);

    /**
     * Buscar turmas por unidade
     */
    List<Turma> findByUnidade(Turma.Unidade unidade);

    /**
     * Buscar turmas por turno
     */
    List<Turma> findByTurno(Turma.Turno turno);

    /**
     * Buscar turmas por dia da semana
     */
    List<Turma> findByDiaSemana(Turma.DiaSemana diaSemana);

    /**
     * Buscar turmas com filtros dinâmicos
     */
    @Query("SELECT t FROM Turma t WHERE " +
           "(:ano IS NULL OR t.ano = :ano) AND " +
           "(:semestre IS NULL OR t.semestre = :semestre) AND " +
           "(:turno IS NULL OR t.turno = :turno) AND " +
           "(:unidade IS NULL OR t.unidade = :unidade)")
    List<Turma> findByFilters(
            @Param("ano") Integer ano,
            @Param("semestre") Turma.Semestre semestre,
            @Param("turno") Turma.Turno turno,
            @Param("unidade") Turma.Unidade unidade
    );

    /**
     * Buscar anos letivos distintos
     */
    @Query("SELECT DISTINCT t.ano FROM Turma t ORDER BY t.ano DESC")
    List<Integer> findDistinctAnos();

    /**
     * Verificar se existe turma com os mesmos parâmetros
     */
    boolean existsByAnoAndSemestreAndTurnoAndUnidadeAndDiaSemana(
            Integer ano,
            Turma.Semestre semestre,
            Turma.Turno turno,
            Turma.Unidade unidade,
            Turma.DiaSemana diaSemana
    );

    /**
     * Contar turmas por ano
     */
    @Query("SELECT COUNT(t) FROM Turma t WHERE t.ano = :ano")
    Long countByAno(@Param("ano") Integer ano);
}
