package com.cidadeemdia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private Boolean ativa = true;

    // sem cascade: excluir categoria não pode apagar ocorrências em silêncio
    @JsonIgnore
    @OneToMany(mappedBy = "categoria")
    private List<Ocorrencia> ocorrencias = new ArrayList<>();
}
