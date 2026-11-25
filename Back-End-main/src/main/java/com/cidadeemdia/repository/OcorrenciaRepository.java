package com.cidadeemdia.repository;

import com.cidadeemdia.entity.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    List<Ocorrencia> findAllByOrderByDataCriacaoDesc();

    List<Ocorrencia> findByCategoriaIdOrderByDataCriacaoDesc(Long categoriaId);

    List<Ocorrencia> findByAutorIdOrderByDataCriacaoDesc(Long autorId);

    @Query("SELECT o FROM Ocorrencia o WHERE o.status = :status ORDER BY o.dataCriacao DESC")
    List<Ocorrencia> buscarPorStatus(@Param("status") Ocorrencia.Status status);

    @Query("SELECT o FROM Ocorrencia o WHERE o.urgencia = :urgencia ORDER BY o.dataCriacao DESC")
    List<Ocorrencia> buscarPorUrgencia(@Param("urgencia") Ocorrencia.Urgencia urgencia);
}
