package com.cidadeemdia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "historicos_status")
@Getter
@Setter
@NoArgsConstructor
public class HistoricoStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "ocorrencia_id")
    private Ocorrencia ocorrencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ocorrencia.Status statusAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ocorrencia.Status statusNovo;

    private String motivo;

    // quem fez a alteração (login do Spring Security) e com qual perfil
    @Column(nullable = false)
    private String responsavel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Usuario.Perfil perfilResponsavel;

    @Column(nullable = false, updatable = false)
    private LocalDateTime data;

    @PrePersist
    void antesDeSalvar() {
        data = LocalDateTime.now();
    }
}
