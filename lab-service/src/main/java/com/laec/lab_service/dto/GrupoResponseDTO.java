package com.laec.lab_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrupoResponseDTO {
    private Integer grupoId;
    private Integer turmaId;
    private Integer numeroGrupo;
    private String nomeGrupo;
    private Integer prioridadeAtual;
    private Integer totalFaltas;
    private Integer totalPrimeiroTurno;
    private Integer totalSegundoTurno;
    private Integer ultimaPosicao;
    private Boolean ativo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
