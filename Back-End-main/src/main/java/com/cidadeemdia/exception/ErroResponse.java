package com.cidadeemdia.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErroResponse(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        Map<String, String> campos
) {
    public ErroResponse(int status, String erro, String mensagem) {
        this(LocalDateTime.now(), status, erro, mensagem, null);
    }
}
