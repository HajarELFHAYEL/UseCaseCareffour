package com.cabinet.medical.service;

import com.cabinet.medical.dto.BookingRequest;
import com.cabinet.medical.dto.BookingResponse;
import com.cabinet.medical.dto.TimeSlotDTO;
import com.cabinet.medical.exception.SlotNotAvailableException;
import com.cabinet.medical.model.Patient;
import com.cabinet.medical.model.TimeSlot;
import com.cabinet.medical.repository.PatientRepository;
import com.cabinet.medical.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final TimeSlotRepository timeSlotRepository;
    private final PatientRepository patientRepository;
    
    /**
     * Récupère tous les créneaux disponibles pour un médecin donné
     * Ne retourne que les créneaux futurs et non réservés
     */
    @Transactional(readOnly = true)
    public List<TimeSlotDTO> getAvailableSlots(Long doctorId) {
        return timeSlotRepository.findAvailableSlotsByDoctorId(doctorId, LocalDateTime.now())
            .stream()
            .map(TimeSlotDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Réserve un créneau pour un patient
     * 
     * Règles métier:
     * - Le créneau doit exister
     * - Le créneau doit être disponible (non réservé)
     * - Le créneau doit être dans le futur
     * - Un même créneau ne peut être réservé que par un seul patient
     */
    @Transactional
    public BookingResponse bookSlot(BookingRequest request) {
        // 1. Récupérer le créneau
        TimeSlot timeSlot = timeSlotRepository.findById(request.getSlotId())
            .orElseThrow(() -> new SlotNotAvailableException("Créneau non trouvé avec l'ID: " + request.getSlotId()));
        
        // 2. Vérifier que le créneau est disponible
        if (!timeSlot.isAvailable()) {
            throw new SlotNotAvailableException("Ce créneau a déjà été réservé par un autre patient");
        }
        
        // 3. Vérifier que le créneau est dans le futur
        if (timeSlot.getStartTime().isBefore(LocalDateTime.now())) {
            throw new SlotNotAvailableException("Impossible de réserver un créneau dans le passé");
        }
        
        // 4. Créer ou récupérer le patient
        Patient patient = patientRepository.findByEmail(request.getPatientEmail())
            .orElseGet(() -> {
                Patient newPatient = new Patient(
                    request.getPatientName(),
                    request.getPatientEmail(),
                    request.getPatientPhone()
                );
                return patientRepository.save(newPatient);
            });
        
        // 5. Réserver le créneau
        timeSlot.setBookedBy(patient);
        timeSlotRepository.save(timeSlot);
        
        // 6. Retourner la confirmation
        return BookingResponse.success(
            timeSlot.getId(),
            timeSlot.getStartTime(),
            timeSlot.getDoctor().getFullName()
        );
    }
}
