package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private boolean success;
    private String message;
    private Long appointmentId;
    private LocalDateTime appointmentTime;
    private String doctorName;
    
    public static BookingResponse success(Long appointmentId, LocalDateTime time, String doctorName) {
        return new BookingResponse(true, "Rendez-vous réservé avec succès", appointmentId, time, doctorName);
    }
    
    public static BookingResponse failure(String message) {
        return new BookingResponse(false, message, null, null, null);
    }
}
