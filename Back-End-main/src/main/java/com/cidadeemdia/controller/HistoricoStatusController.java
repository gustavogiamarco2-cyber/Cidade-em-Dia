package com.cidadeemdia.controller;

import com.cidadeemdia.dto.AtualizarHistoricoStatusDTO;
import com.cidadeemdia.dto.CriarHistoricoStatusDTO;
import com.cidadeemdia.entity.HistoricoStatus;
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
@RequestMapping("/api/v1/historicos-status")
@RequiredArgsConstructor
public class HistoricoStatusController {

    private final OcorrenciaService service;

    @PostMapping
    public ResponseEntity<HistoricoStatus> criar(@Valid @RequestBody CriarHistoricoStatusDTO dto,
                                                  Authentication auth) {
        HistoricoStatus historico = service.criarHistorico(
                dto, auth.getName(), perfilDoUsuario(auth));
        return ResponseEntity.status(HttpStatus.CREATED).body(historico);
    }

    @GetMapping
    public List<HistoricoStatus> listar() {
        return service.listarHistorico();
    }

    @GetMapping("/{id}")
    public HistoricoStatus buscar(@PathVariable Long id) {
        return service.obterHistoricoPorId(id);
    }

    @PutMapping("/{id}")
    public HistoricoStatus atualizar(@PathVariable Long id,
                                     @Valid @RequestBody AtualizarHistoricoStatusDTO dto) {
        return service.atualizarHistorico(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluirHistorico(id);
        return ResponseEntity.noContent().build();
    }

    private Usuario.Perfil perfilDoUsuario(Authentication auth) {
        boolean admin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return admin ? Usuario.Perfil.ADMIN : Usuario.Perfil.ATENDENTE;
    }
}
