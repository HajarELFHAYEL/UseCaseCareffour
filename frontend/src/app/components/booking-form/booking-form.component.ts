import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSlot, Doctor, BookingRequest, BookingResponse } from '../../models/models';

@Component({
    selector: 'app-booking-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="booking-form" *ngIf="slot && doctor">
      <div class="card">
        <div class="card-header">
          <h2>✍️ Réserver votre rendez-vous</h2>
        </div>

        <!-- Résumé de la réservation -->
        <div class="booking-summary">
          <div class="summary-item">
            <span class="label">Médecin</span>
            <span class="value">{{ doctor.fullName }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Spécialité</span>
            <span class="value">{{ doctor.specialtyName }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Date</span>
            <span class="value">{{ formatDate(slot.startTime) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Heure</span>
            <span class="value highlight">{{ formatTime(slot.startTime) }}</span>
          </div>
        </div>

        <!-- Message de succès -->
        @if (bookingSuccess) {
          <div class="alert alert-success animate-fadeIn">
            <span class="success-icon">✅</span>
            <div>
              <strong>Rendez-vous confirmé !</strong>
              <p>{{ successMessage }}</p>
            </div>
          </div>
        }

        <!-- Message d'erreur -->
        @if (errorMessage) {
          <div class="alert alert-error animate-fadeIn">
            <span class="error-icon">❌</span>
            <div>
              <strong>Erreur</strong>
              <p>{{ errorMessage }}</p>
            </div>
          </div>
        }

        <!-- Formulaire -->
        @if (!bookingSuccess) {
          <form (ngSubmit)="onSubmit()" #bookingForm="ngForm">
            <div class="form-group">
              <label class="form-label" for="patientName">Nom complet *</label>
              <input
                type="text"
                id="patientName"
                class="form-input"
                [(ngModel)]="patientName"
                name="patientName"
                placeholder="Jean Dupont"
                required
                #nameInput="ngModel"
                [class.error]="nameInput.invalid && nameInput.touched"
              />
              @if (nameInput.invalid && nameInput.touched) {
                <span class="form-error">Le nom est obligatoire</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="patientEmail">Email *</label>
              <input
                type="email"
                id="patientEmail"
                class="form-input"
                [(ngModel)]="patientEmail"
                name="patientEmail"
                placeholder="jean.dupont@email.com"
                required
                email
                #emailInput="ngModel"
                [class.error]="emailInput.invalid && emailInput.touched"
              />
              @if (emailInput.invalid && emailInput.touched) {
                <span class="form-error">
                  @if (emailInput.errors?.['required']) {
                    L'email est obligatoire
                  } @else {
                    L'email n'est pas valide
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="patientPhone">Téléphone (optionnel)</label>
              <input
                type="tel"
                id="patientPhone"
                class="form-input"
                [(ngModel)]="patientPhone"
                name="patientPhone"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="onCancel()"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="btn btn-success"
                [disabled]="bookingForm.invalid || loading"
              >
                @if (loading) {
                  <span class="spinner-small"></span>
                  Réservation en cours...
                } @else {
                  Confirmer le rendez-vous
                }
              </button>
            </div>
          </form>
        }

        @if (bookingSuccess) {
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-primary"
              (click)="onNewBooking()"
            >
              Prendre un autre rendez-vous
            </button>
          </div>
        }
      </div>
    </div>

    @if (!slot || !doctor) {
      <div class="no-slot-state">
        <span class="info-icon">👆</span>
        <p>Veuillez sélectionner un médecin et un créneau</p>
      </div>
    }
  `,
    styles: [`
    .booking-form {
      animation: fadeIn 0.3s ease-out;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      box-shadow: var(--shadow-lg);
    }

    .card-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: var(--space-5);
    }

    .booking-summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
      padding: var(--space-5);
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-50) 100%);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .summary-item .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--gray-500);
      font-weight: 500;
    }

    .summary-item .value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-800);
    }

    .summary-item .value.highlight {
      color: var(--primary-600);
      font-size: 1.1rem;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    .success-icon,
    .error-icon {
      font-size: 1.5rem;
    }

    .alert strong {
      display: block;
      margin-bottom: var(--space-1);
    }

    .alert p {
      margin: 0;
      font-size: 0.9rem;
    }

    .form-actions {
      display: flex;
      gap: var(--space-4);
      justify-content: flex-end;
      margin-top: var(--space-6);
      padding-top: var(--space-6);
      border-top: 1px solid var(--gray-100);
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .no-slot-state {
      text-align: center;
      padding: var(--space-12);
      color: var(--gray-500);
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
    }

    .info-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: var(--space-4);
    }

    @media (max-width: 640px) {
      .booking-summary {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class BookingFormComponent implements OnInit {
    @Input() slot: TimeSlot | null = null;
    @Input() doctor: Doctor | null = null;
    @Output() bookingComplete = new EventEmitter<BookingResponse>();
    @Output() cancel = new EventEmitter<void>();
    @Output() newBooking = new EventEmitter<void>();

    patientName = '';
    patientEmail = '';
    patientPhone = '';
    loading = false;
    bookingSuccess = false;
    successMessage = '';
    errorMessage = '';

    ngOnInit() {
        this.resetForm();
    }

    formatDate(dateTimeStr: string): string {
        const date = new Date(dateTimeStr);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('fr-FR', options);
    }

    formatTime(dateTimeStr: string): string {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    onSubmit() {
        if (!this.slot) return;

        this.loading = true;
        this.errorMessage = '';

        const request: BookingRequest = {
            slotId: this.slot.id,
            patientName: this.patientName,
            patientEmail: this.patientEmail,
            patientPhone: this.patientPhone || undefined
        };

        this.bookingComplete.emit({ success: true, message: '', appointmentId: null, appointmentTime: null, doctorName: null } as any);
    }

    handleBookingResult(response: BookingResponse) {
        this.loading = false;

        if (response.success) {
            this.bookingSuccess = true;
            this.successMessage = response.message;
        } else {
            this.errorMessage = response.message;
        }
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    setError(message: string) {
        this.loading = false;
        this.errorMessage = message;
    }

    onCancel() {
        this.resetForm();
        this.cancel.emit();
    }

    onNewBooking() {
        this.resetForm();
        this.newBooking.emit();
    }

    private resetForm() {
        this.patientName = '';
        this.patientEmail = '';
        this.patientPhone = '';
        this.bookingSuccess = false;
        this.successMessage = '';
        this.errorMessage = '';
    }
}
