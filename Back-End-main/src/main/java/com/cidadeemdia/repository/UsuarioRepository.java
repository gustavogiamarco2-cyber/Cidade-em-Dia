package com.cidadeemdia.repository;

import com.cidadeemdia.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByPerfilAndAtivoTrue(Usuario.Perfil perfil);
}
