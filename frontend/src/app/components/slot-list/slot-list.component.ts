import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeSlot, Doctor } from '../../models/models';

@Component({
    selector: 'app-slot-list',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
    <div class="slot-list" *ngIf="doctor">
      <div class="section-header">
        <h2>📅 Créneaux disponibles</h2>
        <p class="subtitle">Pour {{ doctor.fullName }} - {{ doctor.specialtyName }}</p>
      </div>

      @if (slots.length > 0) {
        <div class="slots-container">
          @for (slotGroup of groupedSlots; track slotGroup.date) {
            <div class="day-group animate-fadeIn">
              <h3 class="day-title">{{ formatDate(slotGroup.date) }}</h3>
              <div class="slots-grid">
                @for (slot of slotGroup.slots; track slot.id) {
                  <button
                    class="slot-button"
                    [class.selected]="selectedSlot?.id === slot.id"
                    (click)="onSelectSlot(slot)"
                  >
                    <span class="slot-time">{{ formatTime(slot.startTime) }}</span>
                    <span class="slot-duration">30 min</span>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }

      @if (slots.length === 0 && !loading) {
        <div class="empty-state">
          <span class="empty-icon">📭</span>
          <p>Aucun créneau disponible pour ce médecin</p>
          <span class="hint">Veuillez réessayer ultérieurement</span>
        </div>
      }

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Chargement des créneaux...</p>
        </div>
      }
    </div>

    @if (!doctor) {
      <div class="no-doctor-state">
        <span class="arrow-icon">👆</span>
        <p>Veuillez d'abord sélectionner un médecin</p>
      </div>
    }
  `,
    styles: [`
    .slot-list {
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
      color: var(--primary-600);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .slots-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .day-group {
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      box-shadow: var(--shadow-sm);
    }

    .day-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--gray-100);
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--space-3);
    }

    .slot-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-3) var(--space-4);
      background: var(--gray-50);
      border: 2px solid var(--gray-100);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .slot-button:hover {
      background: var(--primary-50);
      border-color: var(--primary-300);
      transform: scale(1.02);
    }

    .slot-button.selected {
      background: var(--primary-500);
      border-color: var(--primary-600);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .slot-time {
      font-size: 1rem;
      font-weight: 600;
    }

    .slot-duration {
      font-size: 0.75rem;
      opacity: 0.8;
      margin-top: var(--space-1);
    }

    .empty-state,
    .loading-state,
    .no-doctor-state {
      text-align: center;
      padding: var(--space-12);
      color: var(--gray-500);
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
    }

    .empty-icon,
    .arrow-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: var(--space-4);
    }

    .hint {
      font-size: 0.875rem;
      color: var(--gray-400);
      margin-top: var(--space-2);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }
  `]
})
export class SlotListComponent {
    @Input() slots: TimeSlot[] = [];
    @Input() doctor: Doctor | null = null;
    @Input() selectedSlot: TimeSlot | null = null;
    @Input() loading = false;
    @Output() slotSelected = new EventEmitter<TimeSlot>();

    get groupedSlots() {
        const groups: { date: string; slots: TimeSlot[] }[] = [];

        this.slots.forEach(slot => {
            const date = slot.startTime.split('T')[0];
            let group = groups.find(g => g.date === date);
            if (!group) {
                group = { date, slots: [] };
                groups.push(group);
            }
            group.slots.push(slot);
        });

        return groups;
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        };
        return date.toLocaleDateString('fr-FR', options);
    }

    formatTime(dateTimeStr: string): string {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    onSelectSlot(slot: TimeSlot) {
        this.slotSelected.emit(slot);
    }
}
