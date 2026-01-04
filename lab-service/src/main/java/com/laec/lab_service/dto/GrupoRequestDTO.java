package com.laec.lab_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrupoRequestDTO {
    
    @NotNull(message = "Turma é obrigatória")
    private Integer turmaId;
    
    @NotNull(message = "Número do grupo é obrigatório")
    private Integer numeroGrupo;
    
    private String nomeGrupo;
}
