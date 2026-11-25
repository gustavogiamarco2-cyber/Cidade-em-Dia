package com.cidadeemdia.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "confirmacoes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"ocorrencia_id", "usuario_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Confirmacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ocorrencia_id")
    private Ocorrencia ocorrencia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String comentario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    void antesDeSalvar() {
        dataCriacao = LocalDateTime.now();
    }
}
