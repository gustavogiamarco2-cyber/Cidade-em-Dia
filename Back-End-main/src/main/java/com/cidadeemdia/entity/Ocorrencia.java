package com.cidadeemdia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ocorrencias")
@Getter
@Setter
@NoArgsConstructor
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false, length = 100)
    private String rua;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(nullable = false, length = 100)
    private String bairro;

    @Column(nullable = false, length = 100)
    private String cidade;

    private String referencia;

    @Column(length = 500)
    private String foto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgencia urgencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioridade prioridade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.NOVA;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(optional = false)
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    private LocalDateTime dataAtualizacao;

    @JsonIgnore
    @OneToMany(mappedBy = "ocorrencia", cascade = CascadeType.REMOVE)
    private List<Confirmacao> confirmacoes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "ocorrencia", cascade = CascadeType.REMOVE)
    private List<HistoricoStatus> historicos = new ArrayList<>();

    public int getTotalConfirmacoes() {
        return confirmacoes.size();
    }

    @PrePersist
    void antesDeSalvar() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = dataCriacao;
    }

    @PreUpdate
    void antesDeAtualizar() {
        dataAtualizacao = LocalDateTime.now();
    }

    public enum Urgencia { BAIXA, MEDIA, ALTA }

    public enum Prioridade { BAIXA, MEDIA, ALTA }

    public enum Status { NOVA, EM_ANALISE, EM_ANDAMENTO, RESOLVIDA }
}
