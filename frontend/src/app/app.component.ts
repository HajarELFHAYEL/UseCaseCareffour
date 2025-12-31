import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
import { SlotListComponent } from './components/slot-list/slot-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { ApiService } from './services/api.service';
import { Doctor, TimeSlot, BookingRequest, BookingResponse } from './models/models';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        DoctorListComponent,
        SlotListComponent,
        BookingFormComponent
    ],
    template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content container">
          <div class="logo">
            <span class="logo-icon">🏥</span>
            <h1>Cabinet Médical</h1>
          </div>
          <p class="tagline">Réservez votre rendez-vous en ligne</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content container">
        <!-- Step indicator -->
        <div class="steps-indicator">
          <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
            <span class="step-number">1</span>
            <span class="step-label">Médecin</span>
          </div>
          <div class="step-line" [class.active]="currentStep > 1"></div>
          <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
            <span class="step-number">2</span>
            <span class="step-label">Créneau</span>
          </div>
          <div class="step-line" [class.active]="currentStep > 2"></div>
          <div class="step" [class.active]="currentStep >= 3">
            <span class="step-number">3</span>
            <span class="step-label">Réservation</span>
          </div>
        </div>

        <div class="content-grid">
          <!-- Left Column - Doctor & Slot Selection -->
          <div class="selection-column">
            <app-doctor-list
              [doctors]="doctors"
              [selectedDoctor]="selectedDoctor"
              [loading]="loadingDoctors"
              (doctorSelected)="onDoctorSelected($event)"
            ></app-doctor-list>

            <app-slot-list
              [slots]="availableSlots"
              [doctor]="selectedDoctor"
              [selectedSlot]="selectedSlot"
              [loading]="loadingSlots"
              (slotSelected)="onSlotSelected($event)"
            ></app-slot-list>
          </div>

          <!-- Right Column - Booking Form -->
          <div class="booking-column">
            <app-booking-form
              #bookingFormRef
              [slot]="selectedSlot"
              [doctor]="selectedDoctor"
              (bookingComplete)="onBookingSubmit($event)"
              (cancel)="onBookingCancel()"
              (newBooking)="onNewBooking()"
            ></app-booking-form>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="container">
          <p>© 2024 Cabinet Médical - Kata Java</p>
        </div>
      </footer>
    </div>
  `,
    styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .app-header {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      padding: var(--space-8) 0;
      box-shadow: var(--shadow-lg);
    }

    .header-content {
      text-align: center;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
    }

    .logo-icon {
      font-size: 2.5rem;
    }

    .logo h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }

    .tagline {
      opacity: 0.9;
      font-size: 1.1rem;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: var(--space-8) var(--space-6);
    }

    /* Steps Indicator */
    .steps-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin-bottom: var(--space-10);
    }

    .step {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: white;
      border-radius: var(--radius-full);
      border: 2px solid var(--gray-200);
      transition: all var(--transition-normal);
    }

    .step.active {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    .step.completed {
      border-color: var(--accent-500);
      background: #d1fae5;
    }

    .step-number {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gray-200);
      color: var(--gray-600);
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.875rem;
    }

    .step.active .step-number {
      background: var(--primary-500);
      color: white;
    }

    .step.completed .step-number {
      background: var(--accent-500);
      color: white;
    }

    .step-label {
      font-weight: 500;
      color: var(--gray-500);
      font-size: 0.9rem;
    }

    .step.active .step-label {
      color: var(--primary-700);
    }

    .step.completed .step-label {
      color: var(--accent-600);
    }

    .step-line {
      width: 40px;
      height: 2px;
      background: var(--gray-200);
      transition: all var(--transition-normal);
    }

    .step-line.active {
      background: var(--primary-500);
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }

    @media (min-width: 1024px) {
      .content-grid {
        grid-template-columns: 1.5fr 1fr;
      }
    }

    .selection-column {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    /* Footer */
    .app-footer {
      background: var(--gray-800);
      color: var(--gray-400);
      padding: var(--space-6) 0;
      text-align: center;
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 640px) {
      .steps-indicator {
        flex-wrap: wrap;
      }

      .step-line {
        display: none;
      }

      .logo h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
    @ViewChild('bookingFormRef') bookingFormRef!: BookingFormComponent;

    doctors: Doctor[] = [];
    availableSlots: TimeSlot[] = [];
    selectedDoctor: Doctor | null = null;
    selectedSlot: TimeSlot | null = null;

    loadingDoctors = false;
    loadingSlots = false;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.loadDoctors();
    }

    get currentStep(): number {
        if (this.selectedSlot) return 3;
        if (this.selectedDoctor) return 2;
        return 1;
    }

    loadDoctors() {
        this.loadingDoctors = true;
        this.apiService.getDoctors().subscribe({
            next: (doctors) => {
                this.doctors = doctors;
                this.loadingDoctors = false;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des médecins:', error);
                this.loadingDoctors = false;
            }
        });
    }

    onDoctorSelected(doctor: Doctor) {
        this.selectedDoctor = doctor;
        this.selectedSlot = null;
        this.availableSlots = [];
        this.loadSlots(doctor.id);
    }

    loadSlots(doctorId: number) {
        this.loadingSlots = true;
        this.apiService.getAvailableSlots(doctorId).subscribe({
            next: (slots) => {
                this.availableSlots = slots;
                this.loadingSlots = false;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des créneaux:', error);
                this.loadingSlots = false;
            }
        });
    }

    onSlotSelected(slot: TimeSlot) {
        this.selectedSlot = slot;
    }

    onBookingSubmit(event: any) {
        if (!this.selectedSlot) return;

        const request: BookingRequest = {
            slotId: this.selectedSlot.id,
            patientName: event.patientName || this.bookingFormRef.patientName,
            patientEmail: event.patientEmail || this.bookingFormRef.patientEmail,
            patientPhone: event.patientPhone || this.bookingFormRef.patientPhone
        };

        this.bookingFormRef.setLoading(true);

        this.apiService.bookAppointment(request).subscribe({
            next: (response) => {
                this.bookingFormRef.handleBookingResult(response);
                if (response.success && this.selectedDoctor) {
                    // Refresh available slots
                    this.loadSlots(this.selectedDoctor.id);
                }
            },
            error: (error) => {
                console.error('Erreur lors de la réservation:', error);
                this.bookingFormRef.setError(
                    error.error?.message || 'Une erreur est survenue lors de la réservation'
                );
            }
        });
    }

    onBookingCancel() {
        this.selectedSlot = null;
    }

    onNewBooking() {
        this.selectedDoctor = null;
        this.selectedSlot = null;
        this.availableSlots = [];
    }
}
