package com.laec.lab_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aulas_praticas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AulaPratica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aula_id")
    private Integer aulaId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @NotNull
    @Column(name = "data_aula", nullable = false)
    private LocalDate dataAula;

    @Column(name = "numero_aula")
    private Integer numeroAula;

    @Column(name = "tema", length = 255)
    private String tema;

    @Column(name = "procedimento", length = 255)
    private String procedimento;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @OneToMany(mappedBy = "aulaPratica", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrupoAula> gruposParticipantes = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
