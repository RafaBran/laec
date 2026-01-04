package com.laec.lab_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "grupos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grupo_id")
    private Integer grupoId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @NotNull
    @Column(name = "numero_grupo", nullable = false)
    private Integer numeroGrupo;

    @Column(name = "nome_grupo", length = 255)
    private String nomeGrupo;

    @Column(name = "prioridade_atual")
    private Integer prioridadeAtual = 0; // Quanto maior, maior a prioridade

    @Column(name = "total_faltas")
    private Integer totalFaltas = 0;

    @Column(name = "total_primeiro_turno")
    private Integer totalPrimeiroTurno = 0;

    @Column(name = "total_segundo_turno")
    private Integer totalSegundoTurno = 0;

    @Column(name = "ultima_posicao")
    private Integer ultimaPosicao; // Posição global na última aula (1-12)

    @Column(name = "ativo")
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
