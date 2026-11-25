package com.cidadeemdia.service;

import com.cidadeemdia.dto.AlterarStatusDTO;
import com.cidadeemdia.dto.AtualizarHistoricoStatusDTO;
import com.cidadeemdia.dto.CriarHistoricoStatusDTO;
import com.cidadeemdia.dto.OcorrenciaDTO;
import com.cidadeemdia.entity.Categoria;
import com.cidadeemdia.entity.HistoricoStatus;
import com.cidadeemdia.entity.Ocorrencia;
import com.cidadeemdia.entity.Usuario;
import com.cidadeemdia.exception.RecursoNaoEncontradoException;
import com.cidadeemdia.exception.ViolacaoRegraNegocioException;
import com.cidadeemdia.repository.HistoricoStatusRepository;
import com.cidadeemdia.repository.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository repository;
    private final HistoricoStatusRepository historicoRepository;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;

    // Regra de negócio: não se registra ocorrência em categoria inativa
    public Ocorrencia criar(OcorrenciaDTO dto) {
        Categoria categoria = categoriaService.obterPorId(dto.categoriaId());
        if (!categoria.getAtiva()) {
            throw new ViolacaoRegraNegocioException(
                    "A categoria '" + categoria.getNome() + "' está inativa e não aceita novas ocorrências");
        }

        Ocorrencia ocorrencia = new Ocorrencia();
        preencher(ocorrencia, dto);
        ocorrencia.setCategoria(categoria);
        ocorrencia.setAutor(usuarioService.obterPorId(dto.autorId()));
        return repository.save(ocorrencia);
    }

    public Ocorrencia obterPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ocorrência " + id + " não encontrada"));
    }

    public List<Ocorrencia> listar() {
        return repository.findAllByOrderByDataCriacaoDesc();
    }

    public List<Ocorrencia> listarPorCategoria(Long categoriaId) {
        return repository.findByCategoriaIdOrderByDataCriacaoDesc(categoriaId);
    }

    public List<Ocorrencia> listarPorStatus(Ocorrencia.Status status) {
        return repository.buscarPorStatus(status);
    }

    public List<Ocorrencia> listarPorAutor(Long autorId) {
        return repository.findByAutorIdOrderByDataCriacaoDesc(autorId);
    }

    public List<Ocorrencia> listarPorUrgencia(Ocorrencia.Urgencia urgencia) {
        return repository.buscarPorUrgencia(urgencia);
    }

    public List<HistoricoStatus> listarHistorico(Long ocorrenciaId) {
        obterPorId(ocorrenciaId); // garante o 404 se a ocorrência não existir
        return historicoRepository.findByOcorrenciaIdOrderByDataDesc(ocorrenciaId);
    }

    public Ocorrencia atualizar(Long id, OcorrenciaDTO dto) {
        Ocorrencia ocorrencia = obterPorId(id);
        Categoria categoria = categoriaService.obterPorId(dto.categoriaId());
        if (!categoria.getAtiva() && !categoria.getId().equals(ocorrencia.getCategoria().getId())) {
            throw new ViolacaoRegraNegocioException(
                    "A categoria '" + categoria.getNome() + "' está inativa e não aceita novas ocorrências");
        }

        preencher(ocorrencia, dto);
        ocorrencia.setCategoria(categoria);
        ocorrencia.setAutor(usuarioService.obterPorId(dto.autorId()));
        return repository.save(ocorrencia);
    }

    public List<HistoricoStatus> listarHistorico() {
        return historicoRepository.findAllByOrderByDataDesc();
    }

    public HistoricoStatus obterHistoricoPorId(Long id) {
        return historicoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Histórico " + id + " não encontrado"));
    }

    public HistoricoStatus criarHistorico(CriarHistoricoStatusDTO dto, String responsavel,
                                          Usuario.Perfil perfil) {
        Ocorrencia ocorrencia = obterPorId(dto.ocorrenciaId());
        return registrarAlteracaoStatus(ocorrencia, dto.statusNovo(), dto.motivo(), responsavel, perfil);
    }

    public HistoricoStatus atualizarHistorico(Long id, AtualizarHistoricoStatusDTO dto) {
        HistoricoStatus historico = obterHistoricoPorId(id);
        if (dto.statusAnterior() == dto.statusNovo()) {
            throw new ViolacaoRegraNegocioException("O histórico deve registrar uma mudança de status");
        }

        historico.setStatusAnterior(dto.statusAnterior());
        historico.setStatusNovo(dto.statusNovo());
        historico.setMotivo(dto.motivo());
        return historicoRepository.save(historico);
    }

    public void excluirHistorico(Long id) {
        historicoRepository.delete(obterHistoricoPorId(id));
    }

    // Funcionalidade específica do PI: andamento da ocorrência com histórico
    public Ocorrencia alterarStatus(Long id, AlterarStatusDTO dto, String responsavel, Usuario.Perfil perfil) {
        Ocorrencia ocorrencia = obterPorId(id);
        registrarAlteracaoStatus(ocorrencia, dto.statusNovo(), dto.motivo(), responsavel, perfil);
        return ocorrencia;
    }

    private HistoricoStatus registrarAlteracaoStatus(Ocorrencia ocorrencia, Ocorrencia.Status novo,
                                                      String motivo, String responsavel,
                                                      Usuario.Perfil perfil) {
        Ocorrencia.Status anterior = ocorrencia.getStatus();

        // Regra de negócio: ocorrência resolvida está encerrada
        if (anterior == Ocorrencia.Status.RESOLVIDA) {
            throw new ViolacaoRegraNegocioException("Ocorrência já resolvida não pode mudar de status");
        }
        if (anterior == novo) {
            throw new ViolacaoRegraNegocioException("A ocorrência já está com o status " + novo);
        }

        ocorrencia.setStatus(novo);
        repository.save(ocorrencia);

        HistoricoStatus historico = new HistoricoStatus();
        historico.setOcorrencia(ocorrencia);
        historico.setStatusAnterior(anterior);
        historico.setStatusNovo(novo);
        historico.setMotivo(motivo);
        historico.setResponsavel(responsavel);
        historico.setPerfilResponsavel(perfil);
        return historicoRepository.save(historico);
    }

    public void excluir(Long id) {
        repository.delete(obterPorId(id));
    }

    private void preencher(Ocorrencia o, OcorrenciaDTO dto) {
        o.setTitulo(dto.titulo());
        o.setDescricao(dto.descricao());
        o.setRua(dto.rua());
        o.setNumero(dto.numero());
        o.setBairro(dto.bairro());
        o.setCidade(dto.cidade());
        o.setReferencia(dto.referencia());
        o.setFoto(dto.foto());
        o.setUrgencia(dto.urgencia());
        o.setPrioridade(dto.prioridade());
    }
}
