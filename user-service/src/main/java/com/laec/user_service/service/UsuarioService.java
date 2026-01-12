package com.laec.user_service.service;

import com.laec.user_service.dto.CreateUsuarioDTO;
import com.laec.user_service.dto.UpdateUsuarioDTO;
import com.laec.user_service.dto.UsuarioDTO;
import com.laec.user_service.model.Usuario;
import com.laec.user_service.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos os usuários
    public List<UsuarioDTO> listarTodos() {
        List<Object[]> results = usuarioRepository.findAllWithGrupoAndTurma();
        
        return results.stream()
                .map(this::convertArrayToDTO)
                .collect(Collectors.toList());
    }

    // Buscar usuário por ID
    public UsuarioDTO buscarPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        return convertToDTO(usuario);
    }

    // Buscar por email
    public UsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
        return convertToDTO(usuario);
    }

    // Listar por tipo
    public List<UsuarioDTO> listarPorTipo(String tipo) {
        return usuarioRepository.findByTipo(tipo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Criar novo usuário
    @Transactional
    public UsuarioDTO criar(CreateUsuarioDTO dto) {
        // Validar se email já existe
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado: " + dto.getEmail());
        }

        // Validar se username já existe
        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username já cadastrado: " + dto.getUsername());
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setUsername(dto.getUsername());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha())); // Criptografa senha
        usuario.setTipo(dto.getTipo());
        usuario.setFotoUrl(dto.getFotoUrl());
        usuario.setCurso(dto.getCurso());
        usuario.setPeriodo(dto.getPeriodo());
        usuario.setTelefone(dto.getTelefone());
        usuario.setGrupoId(dto.getGrupoId());
        usuario.setAtivo(true);

        Usuario salvo = usuarioRepository.save(usuario);
        return convertToDTO(salvo);
    }

    // Atualizar usuário
    @Transactional
    public UsuarioDTO atualizar(Integer id, UpdateUsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        // Atualiza apenas campos não nulos
        if (dto.getNome() != null) {
            usuario.setNome(dto.getNome());
        }
        if (dto.getEmail() != null) {
            // Verifica se email já existe em outro usuário
            if (usuarioRepository.existsByEmail(dto.getEmail()) && 
                !usuario.getEmail().equals(dto.getEmail())) {
                throw new RuntimeException("Email já cadastrado: " + dto.getEmail());
            }
            usuario.setEmail(dto.getEmail());
        }
        if (dto.getUsername() != null) {
            // Verifica se username já existe em outro usuário
            if (usuarioRepository.existsByUsername(dto.getUsername()) && 
                (usuario.getUsername() == null || !usuario.getUsername().equals(dto.getUsername()))) {
                throw new RuntimeException("Username já cadastrado: " + dto.getUsername());
            }
            usuario.setUsername(dto.getUsername());
        }
        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        if (dto.getTipo() != null) {
            usuario.setTipo(dto.getTipo());
        }
        if (dto.getAtivo() != null) {
            usuario.setAtivo(dto.getAtivo());
        }
        if (dto.getFotoUrl() != null) {
            usuario.setFotoUrl(dto.getFotoUrl());
        }
        if (dto.getCurso() != null) {
            usuario.setCurso(dto.getCurso());
        }
        if (dto.getPeriodo() != null) {
            usuario.setPeriodo(dto.getPeriodo());
        }
        if (dto.getTelefone() != null) {
            usuario.setTelefone(dto.getTelefone());
        }
        if (dto.getGrupoId() != null) {
            usuario.setGrupoId(dto.getGrupoId());
        }

        Usuario atualizado = usuarioRepository.save(usuario);
        return convertToDTO(atualizado);
    }

    // Deletar usuário
    @Transactional
    public void deletar(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // Desativar usuário (soft delete)
    @Transactional
    public UsuarioDTO desativar(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        usuario.setAtivo(false);
        Usuario atualizado = usuarioRepository.save(usuario);
        return convertToDTO(atualizado);
    }

    // Ativar usuário
    @Transactional
    public UsuarioDTO ativar(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        usuario.setAtivo(true);
        Usuario atualizado = usuarioRepository.save(usuario);
        return convertToDTO(atualizado);
    }

    // Converter entidade para DTO
    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setUsername(usuario.getUsername());
        dto.setTipo(usuario.getTipo());
        dto.setAtivo(usuario.getAtivo());
        dto.setFotoUrl(usuario.getFotoUrl());
        dto.setCurso(usuario.getCurso());
        dto.setPeriodo(usuario.getPeriodo());
        dto.setTelefone(usuario.getTelefone());
        dto.setGrupoId(usuario.getGrupoId());
        dto.setNumeroGrupo(usuario.getNumeroGrupo());
        dto.setNomeGrupo(usuario.getNomeGrupo());
        dto.setNomeTurma(usuario.getNomeTurma());
        dto.setCreatedAt(usuario.getCreatedAt());
        dto.setUpdatedAt(usuario.getUpdatedAt());
        return dto;
    }
    
    // Converter array de resultado de query nativa para DTO
    private UsuarioDTO convertArrayToDTO(Object[] row) {
        UsuarioDTO dto = new UsuarioDTO();
        
        // Ordem: id, nome, email, username, tipo, ativo, foto_url, curso, periodo, telefone, grupo_id, created_at, updated_at, numero_grupo, nome_grupo, nome_turma
        dto.setId(convertToInteger(row[0]));
        dto.setNome((String) row[1]);
        dto.setEmail((String) row[2]);
        dto.setUsername((String) row[3]);
        dto.setTipo((String) row[4]);
        dto.setAtivo(convertToBoolean(row[5]));
        dto.setFotoUrl((String) row[6]);
        dto.setCurso((String) row[7]);
        dto.setPeriodo((String) row[8]);
        dto.setTelefone((String) row[9]);
        dto.setGrupoId(convertToInteger(row[10]));
        dto.setCreatedAt(row[11] != null ? ((java.sql.Timestamp) row[11]).toLocalDateTime() : null);
        dto.setUpdatedAt(row[12] != null ? ((java.sql.Timestamp) row[12]).toLocalDateTime() : null);
        dto.setNumeroGrupo(convertToInteger(row[13]));
        dto.setNomeGrupo((String) row[14]);
        dto.setNomeTurma((String) row[15]);
        return dto;
    }
    
    // Helper para converter para Integer de forma segura
    private Integer convertToInteger(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Integer) return (Integer) obj;
        if (obj instanceof Number) return ((Number) obj).intValue();
        return null;
    }
    
    // Helper para converter para Boolean de forma segura
    private Boolean convertToBoolean(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Boolean) return (Boolean) obj;
        return Boolean.valueOf(obj.toString());
    }
}
