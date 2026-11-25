package com.cidadeemdia.controller;

import com.cidadeemdia.dto.AlterarStatusDTO;
import com.cidadeemdia.dto.OcorrenciaDTO;
import com.cidadeemdia.entity.HistoricoStatus;
import com.cidadeemdia.entity.Ocorrencia;
import com.cidadeemdia.entity.Usuario;
import com.cidadeemdia.service.OcorrenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ocorrencias")
@RequiredArgsConstructor
public class OcorrenciaController {

    private final OcorrenciaService service;

    @PostMapping
    public ResponseEntity<Ocorrencia> criar(@Valid @RequestBody OcorrenciaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/{id}")
    public Ocorrencia buscar(@PathVariable Long id) {
        return service.obterPorId(id);
    }

    @GetMapping
    public List<Ocorrencia> listar() {
        return service.listar();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Ocorrencia> listarPorCategoria(@PathVariable Long categoriaId) {
        return service.listarPorCategoria(categoriaId);
    }

    @GetMapping("/status/{status}")
    public List<Ocorrencia> listarPorStatus(@PathVariable Ocorrencia.Status status) {
        return service.listarPorStatus(status);
    }

    @GetMapping("/autor/{autorId}")
    public List<Ocorrencia> listarPorAutor(@PathVariable Long autorId) {
        return service.listarPorAutor(autorId);
    }

    @GetMapping("/urgencia/{urgencia}")
    public List<Ocorrencia> listarPorUrgencia(@PathVariable Ocorrencia.Urgencia urgencia) {
        return service.listarPorUrgencia(urgencia);
    }

    @GetMapping("/{id}/historico")
    public List<HistoricoStatus> historico(@PathVariable Long id) {
        return service.listarHistorico(id);
    }

    @PutMapping("/{id}")
    public Ocorrencia atualizar(@PathVariable Long id, @Valid @RequestBody OcorrenciaDTO dto) {
        return service.atualizar(id, dto);
    }

    @PostMapping("/{id}/status")
    public Ocorrencia alterarStatus(@PathVariable Long id,
                                    @Valid @RequestBody AlterarStatusDTO dto,
                                    Authentication auth) {
        boolean admin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Usuario.Perfil perfil = admin ? Usuario.Perfil.ADMIN : Usuario.Perfil.ATENDENTE;

        return service.alterarStatus(id, dto, auth.getName(), perfil);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
