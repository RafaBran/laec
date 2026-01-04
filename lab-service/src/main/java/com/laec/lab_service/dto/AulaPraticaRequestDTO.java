package com.laec.lab_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AulaPraticaRequestDTO {
    
    @NotNull(message = "Turma é obrigatória")
    private Integer turmaId;
    
    @NotNull(message = "Data da aula é obrigatória")
    private LocalDate dataAula;
    
    private Integer numeroAula;
    private String tema;
    private String procedimento;
    private String observacoes;
    
    // IDs dos grupos que participarão (sistema calculará turnos e prioridade)
    private List<Integer> gruposIds;
}
