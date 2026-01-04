package com.laec.auth_service.service;

import com.laec.auth_service.dto.LoginRequestDTO;
import com.laec.auth_service.dto.LoginResponseDTO;
import com.laec.auth_service.dto.RegisterRequestDTO;
import com.laec.auth_service.model.Usuario;
import com.laec.auth_service.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO request) {
        // Buscar usuário ativo pelo username ou email
        Usuario usuario = usuarioRepository.findByUsernameAndAtivo(request.getUsername())
                .or(() -> usuarioRepository.findByEmailAndAtivo(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado ou inativo"));

        // Verificar senha usando BCrypt (compatível com pgcrypto)
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        // Determinar tempo de expiração baseado em rememberMe
        Long expiration = request.isRememberMe() 
            ? jwtService.getRememberExpiration()  // 7 dias
            : jwtService.getDefaultExpiration();   // 4 horas

        // Gerar token JWT com expiração customizada
        String token = jwtService.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getTipo(),
                usuario.getNome(),
                expiration
        );

        return new LoginResponseDTO(
                token,
                usuario.getTipo(),
                usuario.getNome(),
                usuario.getId(),
                usuario.getEmail()
        );
    }

    public LoginResponseDTO register(RegisterRequestDTO request) {
        // Verificar se email já existe
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Criar novo usuário
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha())); // Criptografar senha
        usuario.setTipo(request.getTipo());
        usuario.setCurso(request.getCurso());
        usuario.setPeriodo(request.getPeriodo());
        usuario.setTelefone(request.getTelefone());
        usuario.setAtivo(true);

        // Salvar no banco
        usuario = usuarioRepository.save(usuario);

        // Gerar token JWT
        String token = jwtService.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getTipo(),
                usuario.getNome()
        );

        return new LoginResponseDTO(
                token,
                usuario.getTipo(),
                usuario.getNome(),
                usuario.getId(),
                usuario.getEmail()
        );
    }
}
