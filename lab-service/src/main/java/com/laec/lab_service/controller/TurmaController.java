package com.laec.lab_service.controller;

import com.laec.lab_service.dto.TurmaRequestDTO;
import com.laec.lab_service.dto.TurmaResponseDTO;
import com.laec.lab_service.service.TurmaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
@RequiredArgsConstructor
@Slf4j
public class TurmaController {

    private final TurmaService turmaService;

    /**
     * GET /api/turmas - Lista todas as turmas ou com filtros
     */
    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> getTurmas(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String semestre,
            @RequestParam(required = false) String turno,
            @RequestParam(required = false) String unidade
    ) {
        log.info("GET /api/turmas - Params: ano={}, semestre={}, turno={}, unidade={}", 
                 ano, semestre, turno, unidade);

        // Se tiver algum filtro, usar busca com filtros
        if (ano != null || semestre != null || turno != null || unidade != null) {
            List<TurmaResponseDTO> turmas = turmaService.getTurmasComFiltros(ano, semestre, turno, unidade);
            return ResponseEntity.ok(turmas);
        }

        // Caso contrário, retornar todas
        List<TurmaResponseDTO> turmas = turmaService.getAllTurmas();
        return ResponseEntity.ok(turmas);
    }

    /**
     * GET /api/turmas/{id} - Busca turma por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> getTurmaById(@PathVariable Integer id) {
        log.info("GET /api/turmas/{}", id);
        TurmaResponseDTO turma = turmaService.getTurmaById(id);
        return ResponseEntity.ok(turma);
    }

    /**
     * GET /api/turmas/anos - Lista anos letivos disponíveis
     */
    @GetMapping("/anos")
    public ResponseEntity<List<Integer>> getAnosLetivos() {
        log.info("GET /api/turmas/anos");
        List<Integer> anos = turmaService.getAnosLetivos();
        return ResponseEntity.ok(anos);
    }

    /**
     * GET /api/turmas/anos/{ano}/count - Conta turmas de um ano
     */
    @GetMapping("/anos/{ano}/count")
    public ResponseEntity<Long> contarTurmasPorAno(@PathVariable Integer ano) {
        log.info("GET /api/turmas/anos/{}/count", ano);
        Long count = turmaService.contarTurmasPorAno(ano);
        return ResponseEntity.ok(count);
    }

    /**
     * POST /api/turmas - Cria nova turma
     */
    @PostMapping
    public ResponseEntity<TurmaResponseDTO> criarTurma(@Valid @RequestBody TurmaRequestDTO request) {
        log.info("POST /api/turmas - Body: {}", request);
        TurmaResponseDTO turma = turmaService.criarTurma(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(turma);
    }

    /**
     * PUT /api/turmas/{id} - Atualiza turma existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> atualizarTurma(
            @PathVariable Integer id,
            @Valid @RequestBody TurmaRequestDTO request
    ) {
        log.info("PUT /api/turmas/{} - Body: {}", id, request);
        TurmaResponseDTO turma = turmaService.atualizarTurma(id, request);
        return ResponseEntity.ok(turma);
    }

    /**
     * DELETE /api/turmas/{id} - Deleta turma
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTurma(@PathVariable Integer id) {
        log.info("DELETE /api/turmas/{}", id);
        turmaService.deletarTurma(id);
        return ResponseEntity.noContent().build();
    }
}
