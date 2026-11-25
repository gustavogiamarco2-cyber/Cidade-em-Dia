package com.cidadeemdia.dto;

import com.cidadeemdia.entity.Ocorrencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OcorrenciaDTO(
        @NotBlank(message = "Título é obrigatório")
        @Size(min = 5, max = 100, message = "Título deve ter entre 5 e 100 caracteres")
        String titulo,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(min = 10, max = 500, message = "Descrição deve ter entre 10 e 500 caracteres")
        String descricao,

        @NotBlank(message = "Rua é obrigatória") String rua,
        @NotBlank(message = "Número é obrigatório") String numero,
        @NotBlank(message = "Bairro é obrigatório") String bairro,
        @NotBlank(message = "Cidade é obrigatória") String cidade,

        String referencia,
        String foto,

        @NotNull(message = "Urgência é obrigatória") Ocorrencia.Urgencia urgencia,
        @NotNull(message = "Prioridade é obrigatória") Ocorrencia.Prioridade prioridade,

        @NotNull(message = "Categoria é obrigatória") Long categoriaId,
        @NotNull(message = "Autor é obrigatório") Long autorId
) { }
