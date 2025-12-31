package com.cabinet.medical.exception;

public class SlotNotAvailableException extends RuntimeException {
    
    public SlotNotAvailableException(String message) {
        super(message);
    }
    
    public SlotNotAvailableException(Long slotId) {
        super("Le créneau avec l'ID " + slotId + " n'est pas disponible ou n'existe pas");
    }
}
