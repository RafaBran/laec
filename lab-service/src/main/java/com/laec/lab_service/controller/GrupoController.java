package com.laec.lab_service.controller;

import com.laec.lab_service.dto.GrupoRequestDTO;
import com.laec.lab_service.dto.GrupoResponseDTO;
import com.laec.lab_service.dto.PrioridadeGruposDTO;
import com.laec.lab_service.service.GrupoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
@Slf4j
public class GrupoController {

    private final GrupoService grupoService;

    /**
     * GET /api/grupos - Lista todos os grupos
     */
    @GetMapping
    public ResponseEntity<List<GrupoResponseDTO>> getAllGrupos() {
        log.info("GET /api/grupos");
        List<GrupoResponseDTO> grupos = grupoService.getAllGrupos();
        return ResponseEntity.ok(grupos);
    }

    /**
     * GET /api/grupos/turma/{turmaId} - Lista grupos de uma turma
     */
    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<GrupoResponseDTO>> getGruposByTurma(@PathVariable Integer turmaId) {
        log.info("GET /api/grupos/turma/{}", turmaId);
        List<GrupoResponseDTO> grupos = grupoService.getGruposByTurma(turmaId);
        return ResponseEntity.ok(grupos);
    }

    /**
     * GET /api/grupos/{id} - Busca grupo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GrupoResponseDTO> getGrupoById(@PathVariable Integer id) {
        log.info("GET /api/grupos/{}", id);
        GrupoResponseDTO grupo = grupoService.getGrupoById(id);
        return ResponseEntity.ok(grupo);
    }

    /**
     * GET /api/grupos/turma/{turmaId}/prioridade - Calcula prioridade para próxima aula
     */
    @GetMapping("/turma/{turmaId}/prioridade")
    public ResponseEntity<PrioridadeGruposDTO> getPrioridadeParaProximaAula(@PathVariable Integer turmaId) {
        log.info("GET /api/grupos/turma/{}/prioridade", turmaId);
        PrioridadeGruposDTO prioridade = grupoService.calcularPrioridadeParaProximaAula(turmaId);
        return ResponseEntity.ok(prioridade);
    }

    /**
     * POST /api/grupos - Cria novo grupo
     */
    @PostMapping
    public ResponseEntity<GrupoResponseDTO> criarGrupo(@Valid @RequestBody GrupoRequestDTO request) {
        log.info("POST /api/grupos - Body: {}", request);
        GrupoResponseDTO grupo = grupoService.criarGrupo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(grupo);
    }

    /**
     * PUT /api/grupos/{id} - Atualiza grupo
     */
    @PutMapping("/{id}")
    public ResponseEntity<GrupoResponseDTO> atualizarGrupo(
            @PathVariable Integer id,
            @Valid @RequestBody GrupoRequestDTO request) {
        log.info("PUT /api/grupos/{} - Body: {}", id, request);
        GrupoResponseDTO grupo = grupoService.atualizarGrupo(id, request);
        return ResponseEntity.ok(grupo);
    }

    /**
     * PATCH /api/grupos/{id}/ativo - Ativa/Desativa grupo
     */
    @PatchMapping("/{id}/ativo")
    public ResponseEntity<GrupoResponseDTO> toggleAtivo(
            @PathVariable Integer id,
            @RequestBody java.util.Map<String, Boolean> body) {
        log.info("PATCH /api/grupos/{}/ativo - Body: {}", id, body);
        Boolean ativo = body.get("ativo");
        GrupoResponseDTO grupo = grupoService.toggleAtivo(id, ativo);
        return ResponseEntity.ok(grupo);
    }

    /**
     * DELETE /api/grupos/{id} - Deleta grupo
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarGrupo(@PathVariable Integer id) {
        log.info("DELETE /api/grupos/{}", id);
        grupoService.deletarGrupo(id);
        return ResponseEntity.noContent().build();
    }
}
