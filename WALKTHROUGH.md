# Cabinet Médical - Walkthrough

## ✅ Implementation Complete

L'application Cabinet Médical a été entièrement implémentée avec toutes les fonctionnalités du MVP.

---

## 📂 Project Structure

### Backend (Spring Boot)
```
backend/
├── pom.xml
└── src/main/java/com/cabinet/medical/
    ├── MedicalCabinetApplication.java
    ├── model/
    │   ├── Doctor.java
    │   ├── Specialty.java
    │   ├── TimeSlot.java
    │   └── Patient.java
    ├── repository/
    │   ├── DoctorRepository.java
    │   ├── TimeSlotRepository.java
    │   ├── PatientRepository.java
    │   └── SpecialtyRepository.java
    ├── service/
    │   ├── DoctorService.java
    │   └── AppointmentService.java
    ├── controller/
    │   ├── DoctorController.java
    │   └── AppointmentController.java
    ├── dto/
    │   ├── DoctorDTO.java
    │   ├── TimeSlotDTO.java
    │   ├── BookingRequest.java
    │   └── BookingResponse.java
    ├── exception/
    │   ├── SlotNotAvailableException.java
    │   └── GlobalExceptionHandler.java
    └── config/
        ├── CorsConfig.java
        └── DataInitializer.java
```

### Frontend (Angular)
```
frontend/
├── package.json
├── angular.json
├── tsconfig.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    └── app/
        ├── app.component.ts
        ├── models/
        │   └── models.ts
        ├── services/
        │   └── api.service.ts
        └── components/
            ├── doctor-list/
            ├── slot-list/
            └── booking-form/
```

---

## 🎯 Key Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Database** | H2 In-Memory | Simple for a kata, no setup required |
| **Slot Availability** | `bookedBy` null = available | Clear and simple business logic |
| **Concurrency** | Optimistic Locking (`@Version`) | Prevents double-booking |
| **Frontend** | Standalone components | Modern Angular 17 approach |
| **Styling** | CSS Variables | Flexible design system |

---

## 🚀 How to Run

### Backend
```bash
cd backend
mvn spring-boot:run
# API: http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:4200
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/{id}/slots` | Available slots for doctor |
| POST | `/api/appointments` | Book a slot |

---

## ✅ Test Results

All API endpoints tested successfully:

| Test | Result |
|------|--------|
| `GET /api/doctors` | ✅ Returns 6 doctors with specialties |
| `GET /api/doctors/1/slots` | ✅ Returns available time slots |
| `POST /api/appointments` | ✅ Booking successful (ID 4, Dr. Marie Dupont) |
| Double-booking same slot | ✅ HTTP 409 Conflict - "déjà réservé par un autre patient" |

### Servers Running
- **Backend**: http://localhost:8080 ✅
- **Frontend**: http://localhost:4200 ✅
- **Java version**: 21.0.9 ✅
- **Angular build**: 144.73 kB initial bundle ✅

---

## 📋 MVP User Stories

### US1: Liste des médecins ✅
> En tant que patient, je peux consulter la liste des médecins disponibles.

- 6 médecins avec 5 spécialités différentes
- Affichage en cartes avec sélection visuelle

### US2: Créneaux disponibles ✅
> En tant que patient, je peux visualiser les créneaux de rendez-vous disponibles.

- Créneaux groupés par jour
- Seuls les créneaux futurs et non réservés sont affichés

### US3: Réservation exclusive ✅
> En tant que patient, je peux réserver un créneau horaire disponible.

- Validation du formulaire (nom, email)
- Un créneau ne peut être réservé que par un seul patient
- Protection contre les doubles réservations (HTTP 409)
