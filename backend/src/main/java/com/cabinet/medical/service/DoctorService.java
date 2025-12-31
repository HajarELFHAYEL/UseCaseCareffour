package com.cabinet.medical.service;

import com.cabinet.medical.dto.DoctorDTO;
import com.cabinet.medical.model.Doctor;
import com.cabinet.medical.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DoctorService {
    
    private final DoctorRepository doctorRepository;
    
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAllWithSpecialty()
            .stream()
            .map(DoctorDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    public Optional<DoctorDTO> getDoctorById(Long id) {
        return doctorRepository.findById(id)
            .map(DoctorDTO::fromEntity);
    }
    
    public Optional<Doctor> getDoctorEntityById(Long id) {
        return doctorRepository.findById(id);
    }
    
    public List<DoctorDTO> getDoctorsBySpecialty(Long specialtyId) {
        return doctorRepository.findBySpecialtyId(specialtyId)
            .stream()
            .map(DoctorDTO::fromEntity)
            .collect(Collectors.toList());
    }
}
