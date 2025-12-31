package com.cabinet.medical.controller;

import com.cabinet.medical.dto.DoctorDTO;
import com.cabinet.medical.dto.TimeSlotDTO;
import com.cabinet.medical.service.AppointmentService;
import com.cabinet.medical.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {
    
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    
    /**
     * GET /api/doctors
     * Liste tous les médecins disponibles avec leur spécialité
     */
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }
    
    /**
     * GET /api/doctors/{id}
     * Récupère les détails d'un médecin spécifique
     */
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /api/doctors/{id}/slots
     * Récupère les créneaux disponibles pour un médecin
     */
    @GetMapping("/{id}/slots")
    public ResponseEntity<List<TimeSlotDTO>> getAvailableSlots(@PathVariable Long id) {
        // Vérifier que le médecin existe
        if (doctorService.getDoctorById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<TimeSlotDTO> slots = appointmentService.getAvailableSlots(id);
        return ResponseEntity.ok(slots);
    }
    
    /**
     * GET /api/doctors/specialty/{specialtyId}
     * Liste les médecins par spécialité
     */
    @GetMapping("/specialty/{specialtyId}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialty(@PathVariable Long specialtyId) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialty(specialtyId);
        return ResponseEntity.ok(doctors);
    }
}
