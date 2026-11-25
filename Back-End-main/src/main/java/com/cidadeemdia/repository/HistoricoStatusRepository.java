package com.cidadeemdia.repository;

import com.cidadeemdia.entity.HistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Long> {

    List<HistoricoStatus> findAllByOrderByDataDesc();

    List<HistoricoStatus> findByOcorrenciaIdOrderByDataDesc(Long ocorrenciaId);
}
