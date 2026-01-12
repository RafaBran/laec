package com.laec.user_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String tipo; // professor, tecnico, monitor, aluno, admin

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "foto_url")
    private String fotoUrl;

    private String curso;

    private String periodo;

    private String telefone;

    @Column(name = "grupo_id")
    private Integer grupoId;

    @Transient
    private Integer numeroGrupo;

    @Transient
    private String nomeGrupo;

    @Transient
    private String nomeTurma;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (ativo == null) {
            ativo = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
