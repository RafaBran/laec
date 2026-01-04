package com.laec.lab_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para retornar a lista de grupos ordenados por prioridade
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrioridadeGruposDTO {
    private Integer turmaId;
    private List<GrupoComPrioridade> gruposOrdenados;
    private String explicacao;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GrupoComPrioridade {
        private Integer grupoId;
        private Integer numeroGrupo;
        private String nomeGrupo;
        private Integer prioridadeAtual;
        private Integer totalPrimeiroTurno;
        private Integer totalSegundoTurno;
        private Integer turnoSugerido; // 1 ou 2
        private Integer ordemSugerida; // 1 a 8
        private String motivoPrioridade;
    }
}
