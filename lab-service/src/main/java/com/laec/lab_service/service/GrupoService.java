package com.laec.lab_service.service;

import com.laec.lab_service.dto.GrupoRequestDTO;
import com.laec.lab_service.dto.GrupoResponseDTO;
import com.laec.lab_service.dto.PrioridadeGruposDTO;
import com.laec.lab_service.entity.Grupo;
import com.laec.lab_service.entity.Turma;
import com.laec.lab_service.exception.DuplicateResourceException;
import com.laec.lab_service.exception.ResourceNotFoundException;
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
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final TurmaRepository turmaRepository;

    private static final int MAX_GRUPOS_POR_TURNO = 8;

    @Transactional(readOnly = true)
    public List<GrupoResponseDTO> getAllGrupos() {
        log.info("Buscando todos os grupos");
        return grupoRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GrupoResponseDTO> getGruposByTurma(Integer turmaId) {
        log.info("Buscando grupos da turma: {}", turmaId);
        return grupoRepository.findByTurma_TurmaIdAndAtivoTrue(turmaId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GrupoResponseDTO getGrupoById(Integer id) {
        log.info("Buscando grupo: {}", id);
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + id));
        return toResponseDTO(grupo);
    }

    @Transactional
    public GrupoResponseDTO criarGrupo(GrupoRequestDTO request) {
        log.info("Criando grupo: {}", request);

        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada: " + request.getTurmaId()));

        if (grupoRepository.existsByTurma_TurmaIdAndNumeroGrupo(request.getTurmaId(), request.getNumeroGrupo())) {
            throw new DuplicateResourceException("Já existe grupo com número " + request.getNumeroGrupo() + " nesta turma");
        }

        Grupo grupo = new Grupo();
        grupo.setTurma(turma);
        grupo.setNumeroGrupo(request.getNumeroGrupo());
        grupo.setNomeGrupo(request.getNomeGrupo());
        grupo.setPrioridadeAtual(0);
        grupo.setTotalFaltas(0);
        grupo.setTotalPrimeiroTurno(0);
        grupo.setTotalSegundoTurno(0);
        grupo.setUltimaPosicao(null); // Será definido na primeira aula
        grupo.setAtivo(true);

        Grupo saved = grupoRepository.save(grupo);
        log.info("Grupo criado: {}", saved.getGrupoId());

        return toResponseDTO(saved);
    }

    @Transactional
    public GrupoResponseDTO atualizarGrupo(Integer id, GrupoRequestDTO request) {
        log.info("Atualizando grupo: {}", id);
        
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + id));

        // Verificar se a turma existe
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada: " + request.getTurmaId()));

        // Verificar duplicação de número de grupo (exceto o próprio grupo)
        if (!grupo.getNumeroGrupo().equals(request.getNumeroGrupo()) &&
                grupoRepository.existsByTurma_TurmaIdAndNumeroGrupo(request.getTurmaId(), request.getNumeroGrupo())) {
            throw new DuplicateResourceException("Já existe grupo com número " + request.getNumeroGrupo() + " nesta turma");
        }

        grupo.setTurma(turma);
        grupo.setNumeroGrupo(request.getNumeroGrupo());
        grupo.setNomeGrupo(request.getNomeGrupo());

        Grupo updated = grupoRepository.save(grupo);
        log.info("Grupo atualizado: {}", updated.getGrupoId());

        return toResponseDTO(updated);
    }

    @Transactional
    public GrupoResponseDTO toggleAtivo(Integer id, Boolean ativo) {
        log.info("Alterando status do grupo {}: ativo={}", id, ativo);
        
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + id));

        grupo.setAtivo(ativo);
        Grupo updated = grupoRepository.save(grupo);
        log.info("Status do grupo {} alterado para: {}", id, ativo);

        return toResponseDTO(updated);
    }

    @Transactional
    public void deletarGrupo(Integer id) {
        log.info("Deletando grupo: {}", id);
        if (!grupoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Grupo não encontrado: " + id);
        }
        grupoRepository.deleteById(id);
    }

    /**
     * Calcula e retorna a ordem de prioridade dos grupos para a próxima aula
     * Usa sistema de rodízio puro: quem foi último vira primeiro
     */
    @Transactional(readOnly = true)
    public PrioridadeGruposDTO calcularPrioridadeParaProximaAula(Integer turmaId) {
        log.info("Calculando prioridade para turma: {}", turmaId);

        List<Grupo> grupos = grupoRepository.findByTurmaOrderByPrioridade(turmaId);
        
        if (grupos.isEmpty()) {
            return PrioridadeGruposDTO.builder()
                    .turmaId(turmaId)
                    .gruposOrdenados(new ArrayList<>())
                    .explicacao("Nenhum grupo cadastrado para esta turma")
                    .build();
        }

        List<PrioridadeGruposDTO.GrupoComPrioridade> gruposOrdenados = new ArrayList<>();
        int turno = 1;
        int ordem = 1;

        for (Grupo grupo : grupos) {
            String motivo = String.format("1º turno: %dx | 2º turno: %dx", 
                grupo.getTotalPrimeiroTurno(), 
                grupo.getTotalSegundoTurno());

            gruposOrdenados.add(PrioridadeGruposDTO.GrupoComPrioridade.builder()
                    .grupoId(grupo.getGrupoId())
                    .numeroGrupo(grupo.getNumeroGrupo())
                    .nomeGrupo(grupo.getNomeGrupo())
                    .prioridadeAtual(grupo.getPrioridadeAtual())
                    .totalPrimeiroTurno(grupo.getTotalPrimeiroTurno())
                    .totalSegundoTurno(grupo.getTotalSegundoTurno())
                    .turnoSugerido(turno)
                    .ordemSugerida(ordem)
                    .motivoPrioridade(motivo)
                    .build());

            ordem++;
            if (ordem > MAX_GRUPOS_POR_TURNO) {
                turno = 2;
                ordem = 1;
            }
        }

        String explicacao = gerarExplicacaoPrioridade(grupos.size());

        return PrioridadeGruposDTO.builder()
                .turmaId(turmaId)
                .gruposOrdenados(gruposOrdenados)
                .explicacao(explicacao)
                .build();
    }

    /**
     * Atualiza a prioridade de um grupo após uma aula
     * Sistema de rodízio puro: inverte as posições (último vira primeiro)
     * Incrementa contadores de participação por turno
     */
    @Transactional
    public void atualizarPrioridadeAposAula(Integer grupoId, Integer turno, Boolean presente, Boolean presencaAnterior) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado: " + grupoId));

        // Buscar total de grupos ativos da turma para calcular nova posição
        Long totalGrupos = grupoRepository.countAtivosByTurma(grupo.getTurma().getTurmaId());
        
        // Reverter contadores do estado anterior se necessário
        if (presencaAnterior != null && presencaAnterior != presente) {
            if (presencaAnterior) {
                // Era presente, agora é falta - decrementar contador do turno
                if (turno == 1 && grupo.getTotalPrimeiroTurno() > 0) {
                    grupo.setTotalPrimeiroTurno(grupo.getTotalPrimeiroTurno() - 1);
                } else if (turno == 2 && grupo.getTotalSegundoTurno() > 0) {
                    grupo.setTotalSegundoTurno(grupo.getTotalSegundoTurno() - 1);
                }
            } else {
                // Era falta, agora é presente - decrementar total de faltas
                if (grupo.getTotalFaltas() > 0) {
                    grupo.setTotalFaltas(grupo.getTotalFaltas() - 1);
                }
            }
        }
        
        if (!presente) {
            // Faltou: vai para última posição (posição 0 indica faltante, vai pro final da fila)
            grupo.setUltimaPosicao(0);
            grupo.setTotalFaltas(grupo.getTotalFaltas() + 1);
            log.info("Grupo {} faltou. Vai para posição 0 (final da fila). Total faltas: {}", 
                grupoId, grupo.getTotalFaltas());
        } else {
            // Sistema de rodízio: inverte posição
            // Se estava na posição X de totalGrupos, vai para posição (totalGrupos - X + 1)
            // Exemplo: Total 12 grupos
            //   Posição 12 (último) -> vira posição 1 (primeiro)
            //   Posição 11 -> vira posição 2
            //   Posição 1 (primeiro) -> vira posição 12 (último)
            
            Integer posicaoAtual = grupo.getUltimaPosicao() != null ? grupo.getUltimaPosicao() : totalGrupos.intValue();
            
            // Se estava em posição 0 (faltante anterior), coloca no final
            if (posicaoAtual == 0) {
                posicaoAtual = totalGrupos.intValue();
            }
            
            Integer novaPosicao = totalGrupos.intValue() - posicaoAtual + 1;
            grupo.setUltimaPosicao(novaPosicao);
            
            // Incrementa contador do turno
            if (turno == 1) {
                grupo.setTotalPrimeiroTurno(grupo.getTotalPrimeiroTurno() + 1);
            } else {
                grupo.setTotalSegundoTurno(grupo.getTotalSegundoTurno() + 1);
            }
            
            log.info("Grupo {} presente no {}º turno. Posição {} -> {}. Contadores: 1º={}, 2º={}", 
                grupoId, turno, posicaoAtual, novaPosicao,
                grupo.getTotalPrimeiroTurno(), grupo.getTotalSegundoTurno());
        }

        grupoRepository.save(grupo);
    }

    private String gerarExplicacaoPrioridade(int totalGrupos) {
        if (totalGrupos <= MAX_GRUPOS_POR_TURNO) {
            return "Todos os grupos cabem no primeiro turno (até " + MAX_GRUPOS_POR_TURNO + " grupos).";
        } else {
            int primeiroTurno = Math.min(totalGrupos, MAX_GRUPOS_POR_TURNO);
            int segundoTurno = totalGrupos - primeiroTurno;
            return String.format("Aula dividida em 2 turnos: 1º turno com %d grupos, 2º turno com %d grupos. " +
                    "Sistema de rodízio: quem foi no 2º turno terá prioridade na próxima aula.",
                    primeiroTurno, segundoTurno);
        }
    }

    private GrupoResponseDTO toResponseDTO(Grupo grupo) {
        GrupoResponseDTO.TurmaSimplificadaDTO turmaDTO = null;
        if (grupo.getTurma() != null) {
            turmaDTO = GrupoResponseDTO.TurmaSimplificadaDTO.builder()
                    .turmaId(grupo.getTurma().getTurmaId())
                    .nomeTurma(grupo.getTurma().getNomeTurma())
                    .ano(grupo.getTurma().getAno())
                    .semestre(grupo.getTurma().getSemestre().name())
                    .build();
        }
        
        return GrupoResponseDTO.builder()
                .grupoId(grupo.getGrupoId())
                .turmaId(grupo.getTurma().getTurmaId())
                .numeroGrupo(grupo.getNumeroGrupo())
                .nomeGrupo(grupo.getNomeGrupo())
                .prioridadeAtual(grupo.getPrioridadeAtual())
                .totalFaltas(grupo.getTotalFaltas())
                .totalPrimeiroTurno(grupo.getTotalPrimeiroTurno())
                .totalSegundoTurno(grupo.getTotalSegundoTurno())
                .ultimaPosicao(grupo.getUltimaPosicao())
                .ativo(grupo.getAtivo())
                .turma(turmaDTO)
                .createdAt(grupo.getCreatedAt())
                .updatedAt(grupo.getUpdatedAt())
                .build();
    }
}
