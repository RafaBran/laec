package com.laec.lab_service.controller;

import com.laec.lab_service.dto.AulaPraticaRequestDTO;
import com.laec.lab_service.dto.AulaPraticaResponseDTO;
import com.laec.lab_service.service.AulaPraticaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@RequiredArgsConstructor
@Slf4j
public class AulaPraticaController {

    private final AulaPraticaService aulaPraticaService;

    /**
     * GET /api/aulas/turma/{turmaId} - Lista aulas de uma turma
     */
    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<AulaPraticaResponseDTO>> getAulasByTurma(@PathVariable Integer turmaId) {
        log.info("GET /api/aulas/turma/{}", turmaId);
        List<AulaPraticaResponseDTO> aulas = aulaPraticaService.getAulasByTurma(turmaId);
        return ResponseEntity.ok(aulas);
    }

    /**
     * GET /api/aulas/{id} - Busca aula por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AulaPraticaResponseDTO> getAulaById(@PathVariable Integer id) {
        log.info("GET /api/aulas/{}", id);
        AulaPraticaResponseDTO aula = aulaPraticaService.getAulaById(id);
        return ResponseEntity.ok(aula);
    }

    /**
     * POST /api/aulas - Cria nova aula
     */
    @PostMapping
    public ResponseEntity<AulaPraticaResponseDTO> criarAula(@Valid @RequestBody AulaPraticaRequestDTO request) {
        log.info("POST /api/aulas - Body: {}", request);
        AulaPraticaResponseDTO aula = aulaPraticaService.criarAula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(aula);
    }

    /**
     * POST /api/aulas/{id}/alocar-grupos - Aloca grupos automaticamente com base na prioridade
     */
    @PostMapping("/{id}/alocar-grupos")
    public ResponseEntity<AulaPraticaResponseDTO> alocarGruposAutomaticamente(@PathVariable Integer id) {
        log.info("POST /api/aulas/{}/alocar-grupos", id);
        AulaPraticaResponseDTO aula = aulaPraticaService.alocarGruposAutomaticamente(id);
        return ResponseEntity.ok(aula);
    }

    /**
     * PUT /api/aulas/{id}/concluir - Marca aula como concluída e atualiza prioridades
     */
    @PutMapping("/{id}/concluir")
    public ResponseEntity<AulaPraticaResponseDTO> concluirAula(@PathVariable Integer id) {
        log.info("PUT /api/aulas/{}/concluir", id);
        AulaPraticaResponseDTO aula = aulaPraticaService.concluirAula(id);
        return ResponseEntity.ok(aula);
    }

    /**
     * PUT /api/aulas/presenca/{grupoAulaId} - Marca presença/falta de um grupo
     */
    @PutMapping("/presenca/{grupoAulaId}")
    public ResponseEntity<Void> marcarPresenca(
            @PathVariable Integer grupoAulaId,
            @RequestParam Boolean presente) {
        log.info("PUT /api/aulas/presenca/{} - presente: {}", grupoAulaId, presente);
        aulaPraticaService.marcarPresenca(grupoAulaId, presente);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/aulas/{id} - Deleta aula
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAula(@PathVariable Integer id) {
        log.info("DELETE /api/aulas/{}", id);
        aulaPraticaService.deletarAula(id);
        return ResponseEntity.noContent().build();
    }
}
