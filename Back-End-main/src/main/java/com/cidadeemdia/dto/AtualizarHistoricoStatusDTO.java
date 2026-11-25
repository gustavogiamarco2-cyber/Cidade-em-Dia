package com.cidadeemdia.dto;

import com.cidadeemdia.entity.Ocorrencia;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AtualizarHistoricoStatusDTO(
        @NotNull(message = "Status anterior é obrigatório")
        Ocorrencia.Status statusAnterior,

        @NotNull(message = "Novo status é obrigatório")
        Ocorrencia.Status statusNovo,

        @Size(max = 255, message = "Motivo deve ter no máximo 255 caracteres")
        String motivo
) { }
