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
@Table(name = "turmas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "turma_id")
    private Integer turmaId;

    @NotNull
    @Column(nullable = false)
    private Integer ano;

    @NotNull
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Semestre semestre;

    @NotNull
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Turno turno;

    @NotNull
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Unidade unidade;

    @NotNull
    @Column(name = "dia_semana", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private DiaSemana diaSemana;

    @Column(name = "nome_turma", length = 255)
    private String nomeTurma;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums

    public enum Semestre {
        primeiro, segundo
    }

    public enum Turno {
        matutino, vespertino, noturno
    }

    public enum Unidade {
        bueno, perimetral
    }

    public enum DiaSemana {
        segunda, terca, quarta, quinta, sexta
    }
}
