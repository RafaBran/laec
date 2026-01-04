package com.laec.user_service.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUsuarioDTO {
    
    private String nome;
    
    @Email(message = "Email inválido")
    private String email;
    
    private String username;
    private String senha; // opcional, só se quiser alterar
    private String tipo;
    private Boolean ativo;
    private String fotoUrl;
    private String curso;
    private String periodo;
    private String telefone;
}
