package com.laec.user_service.repository;

import com.laec.user_service.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByUsername(String username);
    
    List<Usuario> findByTipo(String tipo);
    
    List<Usuario> findByAtivo(Boolean ativo);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
}
