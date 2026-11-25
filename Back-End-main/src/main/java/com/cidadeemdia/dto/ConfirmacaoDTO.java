package com.cidadeemdia.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ConfirmacaoDTO(
        @NotNull(message = "Ocorrência é obrigatória")
        Long ocorrenciaId,

        @NotNull(message = "Usuário é obrigatório")
        Long usuarioId,

        @Size(max = 255, message = "Comentário deve ter no máximo 255 caracteres")
        String comentario
) { }
