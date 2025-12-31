package com.cabinet.medical.config;

import com.cabinet.medical.model.Doctor;
import com.cabinet.medical.model.Specialty;
import com.cabinet.medical.model.TimeSlot;
import com.cabinet.medical.repository.DoctorRepository;
import com.cabinet.medical.repository.SpecialtyRepository;
import com.cabinet.medical.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Initialise la base de données avec des données de test
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final SpecialtyRepository specialtyRepository;
    private final DoctorRepository doctorRepository;
    private final TimeSlotRepository timeSlotRepository;
    
    @Override
    public void run(String... args) {
        log.info("Initialisation des données de démonstration...");
        
        // Créer les spécialités
        Specialty generaliste = specialtyRepository.save(new Specialty("Médecine Générale", "Consultation médicale générale"));
        Specialty cardiologue = specialtyRepository.save(new Specialty("Cardiologie", "Spécialiste du cœur et du système cardiovasculaire"));
        Specialty dermatologue = specialtyRepository.save(new Specialty("Dermatologie", "Spécialiste de la peau"));
        Specialty pediatre = specialtyRepository.save(new Specialty("Pédiatrie", "Médecine des enfants"));
        Specialty ophtalmologue = specialtyRepository.save(new Specialty("Ophtalmologie", "Spécialiste des yeux"));
        
        log.info("Spécialités créées: {}", specialtyRepository.count());
        
        // Créer les médecins
        Doctor doc1 = doctorRepository.save(new Doctor("Marie", "Dupont", generaliste));
        Doctor doc2 = doctorRepository.save(new Doctor("Pierre", "Martin", cardiologue));
        Doctor doc3 = doctorRepository.save(new Doctor("Sophie", "Bernard", dermatologue));
        Doctor doc4 = doctorRepository.save(new Doctor("Jean", "Petit", pediatre));
        Doctor doc5 = doctorRepository.save(new Doctor("Claire", "Moreau", ophtalmologue));
        Doctor doc6 = doctorRepository.save(new Doctor("Thomas", "Leroy", generaliste));
        
        log.info("Médecins créés: {}", doctorRepository.count());
        
        // Créer des créneaux pour les 7 prochains jours
        List<Doctor> doctors = List.of(doc1, doc2, doc3, doc4, doc5, doc6);
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS).plusHours(1);
        
        for (Doctor doctor : doctors) {
            // Créneaux pour les 5 prochains jours ouvrables
            for (int day = 0; day < 5; day++) {
                LocalDateTime dayStart = now.plusDays(day).withHour(9).withMinute(0);
                
                // Créneaux du matin (9h-12h)
                for (int hour = 9; hour < 12; hour++) {
                    createSlot(doctor, dayStart.withHour(hour));
                }
                
                // Créneaux de l'après-midi (14h-18h)
                for (int hour = 14; hour < 18; hour++) {
                    createSlot(doctor, dayStart.withHour(hour));
                }
            }
        }
        
        log.info("Créneaux créés: {}", timeSlotRepository.count());
        log.info("Initialisation terminée avec succès!");
    }
    
    private void createSlot(Doctor doctor, LocalDateTime startTime) {
        TimeSlot slot = new TimeSlot(doctor, startTime, startTime.plusMinutes(30));
        timeSlotRepository.save(slot);
    }
}
