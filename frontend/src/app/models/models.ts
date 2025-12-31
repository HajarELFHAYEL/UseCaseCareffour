export interface Specialty {
    id: number;
    name: string;
    description: string;
}

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    specialtyName: string;
    specialtyId: number;
}

export interface TimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    available: boolean;
    doctorId: number;
    doctorName: string;
}

export interface BookingRequest {
    slotId: number;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    appointmentId: number | null;
    appointmentTime: string | null;
    doctorName: string | null;
}
