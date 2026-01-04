package com.laec.lab_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AulaPraticaResponseDTO {
    private Integer aulaId;
    private Integer turmaId;
    private LocalDate dataAula;
    private Integer numeroAula;
    private String tema;
    private String procedimento;
    private String observacoes;
    private List<GrupoAulaDTO> gruposParticipantes;
    private Integer totalGruposPrimeiroTurno;
    private Integer totalGruposSegundoTurno;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GrupoAulaDTO {
        private Integer grupoAulaId;
        private Integer grupoId;
        private Integer numeroGrupo;
        private String nomeGrupo;
        private Integer turno;
        private Integer ordemExecucao;
        private Boolean presente;
        private LocalDateTime horarioInicio;
        private LocalDateTime horarioFim;
        private String observacoes;
    }
}
