package com.cabinet.medical.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    
    @NotNull(message = "L'identifiant du créneau est obligatoire")
    private Long slotId;
    
    @NotBlank(message = "Le nom du patient est obligatoire")
    private String patientName;
    
    @NotBlank(message = "L'email du patient est obligatoire")
    @Email(message = "L'email doit être valide")
    private String patientEmail;
    
    private String patientPhone;
}
