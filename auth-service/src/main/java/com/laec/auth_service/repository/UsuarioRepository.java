package com.laec.auth_service.repository;

import com.laec.auth_service.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.ativo = true")
    Optional<Usuario> findByEmailAndAtivo(String email);
    
    Optional<Usuario> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    @Query("SELECT u FROM Usuario u WHERE u.username = :username AND u.ativo = true")
    Optional<Usuario> findByUsernameAndAtivo(String username);
}
