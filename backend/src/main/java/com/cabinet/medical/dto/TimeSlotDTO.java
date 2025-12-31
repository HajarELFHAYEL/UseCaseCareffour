package com.cabinet.medical.dto;

import com.cabinet.medical.model.TimeSlot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean available;
    private Long doctorId;
    private String doctorName;
    
    public static TimeSlotDTO fromEntity(TimeSlot timeSlot) {
        return new TimeSlotDTO(
            timeSlot.getId(),
            timeSlot.getStartTime(),
            timeSlot.getEndTime(),
            timeSlot.isAvailable(),
            timeSlot.getDoctor().getId(),
            timeSlot.getDoctor().getFullName()
        );
    }
}
