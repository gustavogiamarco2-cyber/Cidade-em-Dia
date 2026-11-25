package com.cidadeemdia.controller;

import com.cidadeemdia.dto.ConfirmacaoDTO;
import com.cidadeemdia.entity.Confirmacao;
import com.cidadeemdia.service.ConfirmacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/confirmacoes")
@RequiredArgsConstructor
public class ConfirmacaoController {

    private final ConfirmacaoService service;

    @PostMapping
    public ResponseEntity<Confirmacao> criar(@Valid @RequestBody ConfirmacaoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/{id}")
    public Confirmacao buscar(@PathVariable Long id) {
        return service.obterPorId(id);
    }

    @GetMapping
    public List<Confirmacao> listar() {
        return service.listar();
    }

    @GetMapping("/ocorrencia/{ocorrenciaId}")
    public List<Confirmacao> listarPorOcorrencia(@PathVariable Long ocorrenciaId) {
        return service.listarPorOcorrencia(ocorrenciaId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Confirmacao> listarPorUsuario(@PathVariable Long usuarioId) {
        return service.listarPorUsuario(usuarioId);
    }

    @PutMapping("/{id}")
    public Confirmacao atualizar(@PathVariable Long id, @Valid @RequestBody ConfirmacaoDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
