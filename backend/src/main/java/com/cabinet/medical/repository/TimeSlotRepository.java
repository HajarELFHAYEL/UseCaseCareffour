package com.cabinet.medical.repository;

import com.cabinet.medical.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    // Récupérer tous les créneaux disponibles pour un médecin
    @Query("SELECT ts FROM TimeSlot ts WHERE ts.doctor.id = :doctorId AND ts.bookedBy IS NULL AND ts.startTime > :now ORDER BY ts.startTime")
    List<TimeSlot> findAvailableSlotsByDoctorId(@Param("doctorId") Long doctorId, @Param("now") LocalDateTime now);
    
    // Récupérer tous les créneaux (disponibles et réservés) pour un médecin
    List<TimeSlot> findByDoctorIdOrderByStartTime(Long doctorId);
}
