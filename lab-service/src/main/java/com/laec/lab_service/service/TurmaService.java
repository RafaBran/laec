package com.laec.lab_service.service;

import com.laec.lab_service.dto.TurmaRequestDTO;
import com.laec.lab_service.dto.TurmaResponseDTO;
import com.laec.lab_service.entity.Turma;
import com.laec.lab_service.exception.ResourceNotFoundException;
import com.laec.lab_service.exception.DuplicateResourceException;
import com.laec.lab_service.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TurmaService {

    private final TurmaRepository turmaRepository;

    /**
     * Listar todas as turmas
     */
    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> getAllTurmas() {
        log.info("Buscando todas as turmas");
        return turmaRepository.findAll().stream()
                .map(TurmaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Buscar turma por ID
     */
    @Transactional(readOnly = true)
    public TurmaResponseDTO getTurmaById(Integer id) {
        log.info("Buscando turma com ID: {}", id);
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com ID: " + id));
        return TurmaResponseDTO.fromEntity(turma);
    }

    /**
     * Buscar turmas por ano
     */
    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> getTurmasByAno(Integer ano) {
        log.info("Buscando turmas do ano: {}", ano);
        return turmaRepository.findByAno(ano).stream()
                .map(TurmaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Buscar turmas por ano e semestre
     */
    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> getTurmasByAnoAndSemestre(Integer ano, String semestre) {
        log.info("Buscando turmas do ano {} e semestre {}", ano, semestre);
        Turma.Semestre semestreEnum = Turma.Semestre.valueOf(semestre);
        return turmaRepository.findByAnoAndSemestre(ano, semestreEnum).stream()
                .map(TurmaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Buscar turmas com filtros
     */
    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> getTurmasComFiltros(
            Integer ano,
            String semestre,
            String turno,
            String unidade) {
        log.info("Buscando turmas com filtros - Ano: {}, Semestre: {}, Turno: {}, Unidade: {}", 
                 ano, semestre, turno, unidade);

        Turma.Semestre semestreEnum = semestre != null ? Turma.Semestre.valueOf(semestre) : null;
        Turma.Turno turnoEnum = turno != null ? Turma.Turno.valueOf(turno) : null;
        Turma.Unidade unidadeEnum = unidade != null ? Turma.Unidade.valueOf(unidade) : null;

        return turmaRepository.findByFilters(ano, semestreEnum, turnoEnum, unidadeEnum).stream()
                .map(TurmaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Buscar anos letivos disponíveis
     */
    @Transactional(readOnly = true)
    public List<Integer> getAnosLetivos() {
        log.info("Buscando anos letivos disponíveis");
        return turmaRepository.findDistinctAnos();
    }

    /**
     * Criar nova turma
     */
    @Transactional
    public TurmaResponseDTO criarTurma(TurmaRequestDTO request) {
        log.info("Criando nova turma: {}", request);

        // Verificar se já existe turma com os mesmos parâmetros
        boolean exists = turmaRepository.existsByAnoAndSemestreAndTurnoAndUnidadeAndDiaSemana(
                request.getAno(),
                request.getSemestre(),
                request.getTurno(),
                request.getUnidade(),
                request.getDiaSemana()
        );

        if (exists) {
            throw new DuplicateResourceException(
                    "Já existe uma turma cadastrada com os mesmos parâmetros (ano, semestre, turno, unidade e dia)");
        }

        Turma turma = new Turma();
        turma.setAno(request.getAno());
        turma.setSemestre(request.getSemestre());
        turma.setTurno(request.getTurno());
        turma.setUnidade(request.getUnidade());
        turma.setDiaSemana(request.getDiaSemana());
        turma.setNomeTurma(request.getNomeTurma());

        Turma saved = turmaRepository.save(turma);
        log.info("Turma criada com sucesso. ID: {}", saved.getTurmaId());

        return TurmaResponseDTO.fromEntity(saved);
    }

    /**
     * Atualizar turma existente
     */
    @Transactional
    public TurmaResponseDTO atualizarTurma(Integer id, TurmaRequestDTO request) {
        log.info("Atualizando turma ID {}: {}", id, request);

        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com ID: " + id));

        turma.setAno(request.getAno());
        turma.setSemestre(request.getSemestre());
        turma.setTurno(request.getTurno());
        turma.setUnidade(request.getUnidade());
        turma.setDiaSemana(request.getDiaSemana());
        turma.setNomeTurma(request.getNomeTurma());

        Turma updated = turmaRepository.save(turma);
        log.info("Turma atualizada com sucesso. ID: {}", id);

        return TurmaResponseDTO.fromEntity(updated);
    }

    /**
     * Deletar turma
     */
    @Transactional
    public void deletarTurma(Integer id) {
        log.info("Deletando turma ID: {}", id);

        if (!turmaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Turma não encontrada com ID: " + id);
        }

        turmaRepository.deleteById(id);
        log.info("Turma deletada com sucesso. ID: {}", id);
    }

    /**
     * Contar turmas por ano
     */
    @Transactional(readOnly = true)
    public Long contarTurmasPorAno(Integer ano) {
        log.info("Contando turmas do ano: {}", ano);
        return turmaRepository.countByAno(ano);
    }
}
