package com.cidadeemdia.service;

import com.cidadeemdia.dto.ConfirmacaoDTO;
import com.cidadeemdia.entity.Confirmacao;
import com.cidadeemdia.exception.RecursoNaoEncontradoException;
import com.cidadeemdia.exception.ViolacaoRegraNegocioException;
import com.cidadeemdia.repository.ConfirmacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ConfirmacaoService {

    private final ConfirmacaoRepository repository;
    private final OcorrenciaService ocorrenciaService;
    private final UsuarioService usuarioService;

    // Regra de negócio: cada usuário confirma uma ocorrência uma única vez
    public Confirmacao criar(ConfirmacaoDTO dto) {
        var ocorrencia = ocorrenciaService.obterPorId(dto.ocorrenciaId());
        var usuario = usuarioService.obterPorId(dto.usuarioId());

        if (repository.existsByOcorrenciaIdAndUsuarioId(ocorrencia.getId(), usuario.getId())) {
            throw new ViolacaoRegraNegocioException("Este usuário já confirmou esta ocorrência");
        }

        Confirmacao confirmacao = new Confirmacao();
        confirmacao.setOcorrencia(ocorrencia);
        confirmacao.setUsuario(usuario);
        confirmacao.setComentario(dto.comentario());
        return repository.save(confirmacao);
    }

    public Confirmacao obterPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Confirmação " + id + " não encontrada"));
    }

    public List<Confirmacao> listar() {
        return repository.findAll();
    }

    public List<Confirmacao> listarPorOcorrencia(Long ocorrenciaId) {
        return repository.findByOcorrencia(ocorrenciaId);
    }

    public List<Confirmacao> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuario(usuarioId);
    }

    // só o comentário pode ser alterado; ocorrência e usuário são fixos
    public Confirmacao atualizar(Long id, ConfirmacaoDTO dto) {
        Confirmacao confirmacao = obterPorId(id);
        confirmacao.setComentario(dto.comentario());
        return repository.save(confirmacao);
    }

    public void excluir(Long id) {
        repository.delete(obterPorId(id));
    }
}
