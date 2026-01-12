package com.laec.lab_service.dto;

import com.laec.lab_service.entity.Turma;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.Year;

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
    private AnoLetivoDTO anoLetivo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnoLetivoDTO {
        private Integer anoLetivoId;
        private Integer ano;
        private String descricao;
        private Boolean ativo;
    }

    public static TurmaResponseDTO fromEntity(Turma turma) {
        // Criar AnoLetivoDTO baseado no campo ano da turma
        int anoAtual = Year.now().getValue();
        AnoLetivoDTO anoLetivoDTO = AnoLetivoDTO.builder()
                .anoLetivoId(turma.getAno()) // Usar o próprio ano como ID
                .ano(turma.getAno())
                .descricao(String.valueOf(turma.getAno()))
                .ativo(turma.getAno() == anoAtual)
                .build();

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
                .anoLetivo(anoLetivoDTO)
                .build();
    }
}
