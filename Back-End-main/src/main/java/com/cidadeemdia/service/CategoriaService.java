package com.cidadeemdia.service;

import com.cidadeemdia.dto.CategoriaDTO;
import com.cidadeemdia.entity.Categoria;
import com.cidadeemdia.exception.RecursoNaoEncontradoException;
import com.cidadeemdia.exception.ViolacaoRegraNegocioException;
import com.cidadeemdia.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public Categoria criar(CategoriaDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNome(dto.nome());
        categoria.setDescricao(dto.descricao());
        if (dto.ativa() != null) {
            categoria.setAtiva(dto.ativa());
        }
        return repository.save(categoria);
    }

    public Categoria obterPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria " + id + " não encontrada"));
    }

    public List<Categoria> listar() {
        return repository.findAll();
    }

    public List<Categoria> listarAtivas() {
        return repository.findByAtivaTrue();
    }

    public Categoria atualizar(Long id, CategoriaDTO dto) {
        Categoria categoria = obterPorId(id);
        categoria.setNome(dto.nome());
        categoria.setDescricao(dto.descricao());
        if (dto.ativa() != null) {
            categoria.setAtiva(dto.ativa());
        }
        return repository.save(categoria);
    }

    // Regra de negócio: categoria com ocorrências não pode ser excluída
    public void excluir(Long id) {
        Categoria categoria = obterPorId(id);

        int total = categoria.getOcorrencias().size();
        if (total > 0) {
            throw new ViolacaoRegraNegocioException(
                    "A categoria '" + categoria.getNome() + "' tem " + total + " ocorrência(s) e não pode ser excluída");
        }
        repository.delete(categoria);
    }
}
