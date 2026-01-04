package com.laec.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    
    private Integer id;
    private String nome;
    private String email;
    private String username;
    private String tipo;
    private Boolean ativo;
    private String fotoUrl;
    private String curso;
    private String periodo;
    private String telefone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
