package com.laec.user_service.repository;

import com.laec.user_service.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    
    @Query(value = """
        SELECT 
            u.id, u.nome, u.email, u.username, u.tipo, u.ativo, 
            u.foto_url, u.curso, u.periodo, u.telefone, u.grupo_id,
            u.created_at, u.updated_at,
            g.numero_grupo, g.nome_grupo, t.nome_turma
        FROM usuarios u
        LEFT JOIN grupos g ON u.grupo_id = g.grupo_id
        LEFT JOIN turmas t ON g.turma_id = t.turma_id
        """, nativeQuery = true)
    List<Object[]> findAllWithGrupoAndTurma();
}
