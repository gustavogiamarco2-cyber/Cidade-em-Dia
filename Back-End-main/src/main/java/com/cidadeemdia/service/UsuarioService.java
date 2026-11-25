package com.cidadeemdia.service;

import com.cidadeemdia.dto.UsuarioDTO;
import com.cidadeemdia.entity.Usuario;
import com.cidadeemdia.exception.RecursoNaoEncontradoException;
import com.cidadeemdia.exception.ViolacaoRegraNegocioException;
import com.cidadeemdia.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public Usuario criar(UsuarioDTO dto) {
        validarEmailLivre(dto.email(), null);

        Usuario usuario = new Usuario();
        preencher(usuario, dto);
        return repository.save(usuario);
    }

    public Usuario obterPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário " + id + " não encontrado"));
    }

    public Usuario obterPorEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário com email " + email + " não encontrado"));
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public List<Usuario> listarPorPerfil(Usuario.Perfil perfil) {
        return repository.findByPerfilAndAtivoTrue(perfil);
    }

    public Usuario atualizar(Long id, UsuarioDTO dto) {
        Usuario usuario = obterPorId(id);
        validarEmailLivre(dto.email(), id);
        preencher(usuario, dto);
        return repository.save(usuario);
    }

    public void excluir(Long id) {
        repository.delete(obterPorId(id));
    }

    private void preencher(Usuario usuario, UsuarioDTO dto) {
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setPerfil(dto.perfil());
        if (dto.ativo() != null) {
            usuario.setAtivo(dto.ativo());
        }
    }

    private void validarEmailLivre(String email, Long idAtual) {
        repository.findByEmail(email)
                .filter(u -> !u.getId().equals(idAtual))
                .ifPresent(u -> {
                    throw new ViolacaoRegraNegocioException("O email " + email + " já está em uso");
                });
    }
}
