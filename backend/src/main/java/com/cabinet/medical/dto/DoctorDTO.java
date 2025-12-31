package com.cabinet.medical.dto;

import com.cabinet.medical.model.Doctor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String specialtyName;
    private Long specialtyId;
    
    public static DoctorDTO fromEntity(Doctor doctor) {
        return new DoctorDTO(
            doctor.getId(),
            doctor.getFirstName(),
            doctor.getLastName(),
            doctor.getFullName(),
            doctor.getSpecialty().getName(),
            doctor.getSpecialty().getId()
        );
    }
}
