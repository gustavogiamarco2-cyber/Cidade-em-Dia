package com.cidadeemdia.controller;

import com.cidadeemdia.dto.CategoriaDTO;
import com.cidadeemdia.entity.Categoria;
import com.cidadeemdia.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService service;

    @PostMapping
    public ResponseEntity<Categoria> criar(@Valid @RequestBody CategoriaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/{id}")
    public Categoria buscar(@PathVariable Long id) {
        return service.obterPorId(id);
    }

    @GetMapping
    public List<Categoria> listar() {
        return service.listar();
    }

    @GetMapping("/ativas")
    public List<Categoria> listarAtivas() {
        return service.listarAtivas();
    }

    @PutMapping("/{id}")
    public Categoria atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
