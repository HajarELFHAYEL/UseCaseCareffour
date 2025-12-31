package com.cabinet.medical.controller;

import com.cabinet.medical.dto.BookingRequest;
import com.cabinet.medical.dto.BookingResponse;
import com.cabinet.medical.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    /**
     * POST /api/appointments
     * Réserve un créneau pour un patient
     * 
     * Le créneau ne peut être réservé que par un seul patient.
     * Si le créneau est déjà réservé, une erreur CONFLICT (409) est retournée.
     */
    @PostMapping
    public ResponseEntity<BookingResponse> bookAppointment(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = appointmentService.bookSlot(request);
        return ResponseEntity.ok(response);
    }
}
