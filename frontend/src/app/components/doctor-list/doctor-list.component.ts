import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../models/models';

@Component({
    selector: 'app-doctor-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="doctor-list">
      <div class="section-header">
        <h2>🏥 Nos Médecins</h2>
        <p class="subtitle">Sélectionnez un médecin pour voir ses disponibilités</p>
      </div>

      <div class="doctors-grid">
        @for (doctor of doctors; track doctor.id) {
          <div 
            class="doctor-card"
            [class.selected]="selectedDoctor?.id === doctor.id"
            (click)="onSelectDoctor(doctor)"
          >
            <div class="doctor-avatar">
              <span class="avatar-icon">👨‍⚕️</span>
            </div>
            <div class="doctor-info">
              <h3 class="doctor-name">{{ doctor.fullName }}</h3>
              <span class="badge badge-primary">{{ doctor.specialtyName }}</span>
            </div>
            <div class="select-indicator">
              @if (selectedDoctor?.id === doctor.id) {
                <span class="check-icon">✓</span>
              }
            </div>
          </div>
        }
      </div>

      @if (doctors.length === 0 && !loading) {
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p>Aucun médecin disponible pour le moment</p>
        </div>
      }

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des médecins...</p>
        </div>
      }
    </div>
  `,
    styles: [`
    .doctor-list {
      margin-bottom: var(--space-8);
    }

    .section-header {
      margin-bottom: var(--space-6);
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: var(--space-2);
    }

    .subtitle {
      color: var(--gray-500);
      font-size: 0.95rem;
    }

    .doctors-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .doctors-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .doctors-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .doctor-card {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-5);
      background: white;
      border: 2px solid var(--gray-100);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-normal);
    }

    .doctor-card:hover {
      border-color: var(--primary-200);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .doctor-card.selected {
      border-color: var(--primary-500);
      background: var(--primary-50);
      box-shadow: var(--shadow-lg);
    }

    .doctor-avatar {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-icon {
      font-size: 1.5rem;
    }

    .doctor-info {
      flex: 1;
    }

    .doctor-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: var(--space-1);
    }

    .select-indicator {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .check-icon {
      width: 28px;
      height: 28px;
      background: var(--primary-500);
      color: white;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: bold;
      animation: scaleIn 0.2s ease-out;
    }

    @keyframes scaleIn {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }

    .empty-state,
    .loading-state {
      text-align: center;
      padding: var(--space-12);
      color: var(--gray-500);
    }

    .empty-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: var(--space-4);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }
  `]
})
export class DoctorListComponent {
    @Input() doctors: Doctor[] = [];
    @Input() selectedDoctor: Doctor | null = null;
    @Input() loading = false;
    @Output() doctorSelected = new EventEmitter<Doctor>();

    onSelectDoctor(doctor: Doctor) {
        this.doctorSelected.emit(doctor);
    }
}
