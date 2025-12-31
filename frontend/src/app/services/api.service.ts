import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, TimeSlot, BookingRequest, BookingResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    /**
     * Récupère la liste de tous les médecins
     */
    getDoctors(): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(`${this.baseUrl}/doctors`);
    }

    /**
     * Récupère un médecin par son ID
     */
    getDoctor(id: number): Observable<Doctor> {
        return this.http.get<Doctor>(`${this.baseUrl}/doctors/${id}`);
    }

    /**
     * Récupère les créneaux disponibles pour un médecin
     */
    getAvailableSlots(doctorId: number): Observable<TimeSlot[]> {
        return this.http.get<TimeSlot[]>(`${this.baseUrl}/doctors/${doctorId}/slots`);
    }

    /**
     * Réserve un créneau
     */
    bookAppointment(request: BookingRequest): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(`${this.baseUrl}/appointments`, request);
    }
}
