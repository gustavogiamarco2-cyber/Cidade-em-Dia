package com.cidadeemdia.controller;

import com.cidadeemdia.dto.UsuarioDTO;
import com.cidadeemdia.entity.Usuario;
import com.cidadeemdia.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    @PostMapping
    public ResponseEntity<Usuario> criar(@Valid @RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return service.obterPorId(id);
    }

    @GetMapping("/email/{email}")
    public Usuario buscarPorEmail(@PathVariable String email) {
        return service.obterPorEmail(email);
    }

    @GetMapping
    public List<Usuario> listar() {
        return service.listar();
    }

    @GetMapping("/perfil/{perfil}")
    public List<Usuario> listarPorPerfil(@PathVariable Usuario.Perfil perfil) {
        return service.listarPorPerfil(perfil);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
