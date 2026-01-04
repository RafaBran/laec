package com.laec.lab_service.dto;

import com.laec.lab_service.entity.Turma;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurmaResponseDTO {

    private Integer turmaId;
    private Integer ano;
    private String semestre;
    private String turno;
    private String unidade;
    private String diaSemana;
    private String nomeTurma;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TurmaResponseDTO fromEntity(Turma turma) {
        return TurmaResponseDTO.builder()
                .turmaId(turma.getTurmaId())
                .ano(turma.getAno())
                .semestre(turma.getSemestre().name())
                .turno(turma.getTurno().name())
                .unidade(turma.getUnidade().name())
                .diaSemana(turma.getDiaSemana().name())
                .nomeTurma(turma.getNomeTurma())
                .createdAt(turma.getCreatedAt())
                .updatedAt(turma.getUpdatedAt())
                .build();
    }
}
