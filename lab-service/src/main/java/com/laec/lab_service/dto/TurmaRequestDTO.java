package com.laec.lab_service.dto;

import com.laec.lab_service.entity.Turma;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaRequestDTO {

    @NotNull(message = "Ano é obrigatório")
    private Integer ano;

    @NotNull(message = "Semestre é obrigatório")
    private Turma.Semestre semestre;

    @NotNull(message = "Turno é obrigatório")
    private Turma.Turno turno;

    @NotNull(message = "Unidade é obrigatória")
    private Turma.Unidade unidade;

    @NotNull(message = "Dia da semana é obrigatório")
    private Turma.DiaSemana diaSemana;

    private String nomeTurma;
}
