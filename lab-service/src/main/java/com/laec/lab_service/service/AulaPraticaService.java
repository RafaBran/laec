package com.laec.lab_service.service;

import com.laec.lab_service.dto.AulaPraticaRequestDTO;
import com.laec.lab_service.dto.AulaPraticaResponseDTO;
import com.laec.lab_service.dto.PrioridadeGruposDTO;
import com.laec.lab_service.entity.AulaPratica;
import com.laec.lab_service.entity.Grupo;
import com.laec.lab_service.entity.GrupoAula;
import com.laec.lab_service.entity.Turma;
import com.laec.lab_service.exception.DuplicateResourceException;
import com.laec.lab_service.exception.ResourceNotFoundException;
import com.laec.lab_service.repository.AulaPraticaRepository;
import com.laec.lab_service.repository.GrupoAulaRepository;
import com.laec.lab_service.repository.GrupoRepository;
import com.laec.lab_service.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AulaPraticaService {

    private final AulaPraticaRepository aulaPraticaRepository;
    private final GrupoRepository grupoRepository;
    private final GrupoAulaRepository grupoAulaRepository;
    private final TurmaRepository turmaRepository;
    private final GrupoService grupoService;

    private static final int MAX_GRUPOS_POR_TURNO = 8;

    @Transactional(readOnly = true)
    public List<AulaPraticaResponseDTO> getAulasByTurma(Integer turmaId) {
        log.info("Buscando aulas da turma: {}", turmaId);
        
        List<AulaPratica> aulas = aulaPraticaRepository.findByTurma_TurmaIdOrderByDataAulaDesc(turmaId);
        
        return aulas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AulaPraticaResponseDTO getAulaById(Integer id) {
        log.info("Buscando aula: {}", id);
        
        AulaPratica aula = aulaPraticaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada: " + id));
        
        return toResponseDTO(aula);
    }

    @Transactional
    public AulaPraticaResponseDTO criarAula(AulaPraticaRequestDTO request) {
        log.info("Criando aula prática: {}", request);

        // Validar turma
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada: " + request.getTurmaId()));

        // Verificar se já existe aula na data
        if (aulaPraticaRepository.existsByTurma_TurmaIdAndDataAula(request.getTurmaId(), request.getDataAula())) {
            throw new DuplicateResourceException("Já existe uma aula cadastrada nesta data para esta turma");
        }

        // Criar aula
        AulaPratica aula = new AulaPratica();
        aula.setTurma(turma);
        aula.setDataAula(request.getDataAula());
        aula.setNumeroAula(request.getNumeroAula());
        aula.setTema(request.getTema());
        aula.setProcedimento(request.getProcedimento());
        aula.setObservacoes(request.getObservacoes());

        AulaPratica savedAula = aulaPraticaRepository.save(aula);

        // Se foram especificados grupos, alocar automaticamente com base na prioridade
        if (request.getGruposIds() != null && !request.getGruposIds().isEmpty()) {
            alocarGruposNaAula(savedAula, request.getGruposIds());
        }

        log.info("Aula criada: {}", savedAula.getAulaId());
        
        return toResponseDTO(savedAula);
    }

    @Transactional
    public AulaPraticaResponseDTO alocarGruposAutomaticamente(Integer aulaId) {
        log.info("Alocando grupos automaticamente para aula: {}", aulaId);

        AulaPratica aula = aulaPraticaRepository.findById(aulaId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada: " + aulaId));

        // Buscar todos os grupos ativos da turma ordenados por prioridade
        List<Grupo> grupos = grupoRepository.findByTurmaOrderByPrioridade(aula.getTurma().getTurmaId());

        if (grupos.isEmpty()) {
            throw new IllegalStateException("Não há grupos cadastrados para esta turma");
        }

        List<Integer> gruposIds = grupos.stream()
                .map(Grupo::getGrupoId)
                .collect(Collectors.toList());

        alocarGruposNaAula(aula, gruposIds);

        return toResponseDTO(aula);
    }

    private void alocarGruposNaAula(AulaPratica aula, List<Integer> gruposIds) {
        // Obter ordem de prioridade
        PrioridadeGruposDTO prioridade = grupoService.calcularPrioridadeParaProximaAula(aula.getTurma().getTurmaId());

        // Mapear IDs para ordem de prioridade
        List<PrioridadeGruposDTO.GrupoComPrioridade> gruposOrdenados = prioridade.getGruposOrdenados().stream()
                .filter(g -> gruposIds.contains(g.getGrupoId()))
                .collect(Collectors.toList());

        // Criar registros de participação
        for (PrioridadeGruposDTO.GrupoComPrioridade grupoPrioridade : gruposOrdenados) {
            Grupo grupo = grupoRepository.findById(grupoPrioridade.getGrupoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + grupoPrioridade.getGrupoId()));

            GrupoAula grupoAula = new GrupoAula();
            grupoAula.setAulaPratica(aula);
            grupoAula.setGrupo(grupo);
            grupoAula.setTurno(grupoPrioridade.getTurnoSugerido());
            grupoAula.setOrdemExecucao(grupoPrioridade.getOrdemSugerida());
            grupoAula.setPresente(true); // Padrão: presente

            grupoAulaRepository.save(grupoAula);
            
            log.info("Grupo {} alocado no turno {} ordem {}", 
                    grupo.getNumeroGrupo(), grupoPrioridade.getTurnoSugerido(), grupoPrioridade.getOrdemSugerida());
        }
    }

    @Transactional
    public AulaPraticaResponseDTO concluirAula(Integer aulaId) {
        log.info("Concluindo aula (atualizando prioridades): {}", aulaId);

        AulaPratica aula = aulaPraticaRepository.findById(aulaId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada: " + aulaId));

        // Atualizar prioridades dos grupos com base na participação
        List<GrupoAula> participacoes = grupoAulaRepository.findByAulaPratica_AulaId(aulaId);
        for (GrupoAula participacao : participacoes) {
            grupoService.atualizarPrioridadeAposAula(
                    participacao.getGrupo().getGrupoId(),
                    participacao.getTurno(),
                    participacao.getPresente(),
                    null // Sem presença anterior no concluir aula
            );
        }

        log.info("Prioridades atualizadas para {} grupos", participacoes.size());
        
        return toResponseDTO(aula);
    }

    @Transactional
    public void marcarPresenca(Integer grupoAulaId, Boolean presente) {
        log.info("Marcando presença {} para grupoAula: {}", presente, grupoAulaId);

        GrupoAula grupoAula = grupoAulaRepository.findById(grupoAulaId)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de grupo na aula não encontrado: " + grupoAulaId));

        Boolean presencaAnterior = grupoAula.getPresente();
        grupoAula.setPresente(presente);
        grupoAulaRepository.save(grupoAula);
        
        // Atualizar prioridades imediatamente se houve mudança na presença
        if (!presencaAnterior.equals(presente)) {
            log.info("Presença alterada de {} para {}. Atualizando prioridades...", presencaAnterior, presente);
            grupoService.atualizarPrioridadeAposAula(
                grupoAula.getGrupo().getGrupoId(),
                grupoAula.getTurno(),
                presente,
                presencaAnterior
            );
        }
    }

    @Transactional
    public void deletarAula(Integer id) {
        log.info("Deletando aula: {}", id);
        
        if (!aulaPraticaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Aula não encontrada: " + id);
        }
        
        aulaPraticaRepository.deleteById(id);
    }

    private AulaPraticaResponseDTO toResponseDTO(AulaPratica aula) {
        List<AulaPraticaResponseDTO.GrupoAulaDTO> gruposParticipantes = aula.getGruposParticipantes().stream()
                .map(ga -> AulaPraticaResponseDTO.GrupoAulaDTO.builder()
                        .grupoAulaId(ga.getGrupoAulaId())
                        .grupoId(ga.getGrupo().getGrupoId())
                        .numeroGrupo(ga.getGrupo().getNumeroGrupo())
                        .nomeGrupo(ga.getGrupo().getNomeGrupo())
                        .turno(ga.getTurno())
                        .ordemExecucao(ga.getOrdemExecucao())
                        .presente(ga.getPresente())
                        .horarioInicio(ga.getHorarioInicio())
                        .horarioFim(ga.getHorarioFim())
                        .observacoes(ga.getObservacoes())
                        .build())
                .collect(Collectors.toList());

        long primeiroTurno = gruposParticipantes.stream().filter(g -> g.getTurno() == 1).count();
        long segundoTurno = gruposParticipantes.stream().filter(g -> g.getTurno() == 2).count();

        return AulaPraticaResponseDTO.builder()
                .aulaId(aula.getAulaId())
                .turmaId(aula.getTurma().getTurmaId())
                .dataAula(aula.getDataAula())
                .numeroAula(aula.getNumeroAula())
                .tema(aula.getTema())
                .procedimento(aula.getProcedimento())
                .observacoes(aula.getObservacoes())

                .gruposParticipantes(gruposParticipantes)
                .totalGruposPrimeiroTurno((int) primeiroTurno)
                .totalGruposSegundoTurno((int) segundoTurno)
                .createdAt(aula.getCreatedAt())
                .updatedAt(aula.getUpdatedAt())
                .build();
    }
}
