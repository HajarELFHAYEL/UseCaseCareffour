# Cabinet Médical - Système de Réservation de Rendez-vous

Application de gestion de rendez-vous pour cabinet médical, développée avec **Spring Boot** (backend) et **Angular** (frontend).

## Fonctionnalités (MVP)

- ✅ **Consulter les médecins** : Liste des médecins avec leurs spécialités
- ✅ **Voir les créneaux** : Affichage des créneaux disponibles par médecin
- ✅ **Réserver un créneau** : Formulaire de réservation avec validation

## Technologies

### Backend
- **Java 21**
- **Spring Boot 3.2.1**
- **Spring Data JPA**
- **H2 Database** (base en mémoire)
- **Lombok**

### Frontend
- **Angular 17**
- **TypeScript**
- **CSS pur** (design system personnalisé)

## Architecture

```
project/
├── backend/                    # Application Spring Boot
│   ├── src/main/java/com/cabinet/medical/
│   │   ├── model/              # Entités JPA (Doctor, TimeSlot, Patient, Specialty)
│   │   ├── repository/         # Repositories Spring Data
│   │   ├── service/            # Logique métier
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Objets de transfert de données
│   │   ├── exception/          # Gestion des erreurs
│   │   └── config/             # Configuration (CORS, données initiales)
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # Application Angular
│   └── src/app/
│       ├── components/         # Composants UI
│       ├── services/           # Communication API
│       └── models/             # Interfaces TypeScript
└── README.md
```

## Instructions de lancement

### Prérequis
- Java 21
- Node.js 18+ et npm
- Maven

### Backend

```bash
cd backend
mvn spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm start
```

L'application est accessible sur `http://localhost:4200`

## API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/doctors` | Liste tous les médecins |
| GET | `/api/doctors/{id}` | Détails d'un médecin |
| GET | `/api/doctors/{id}/slots` | Créneaux disponibles d'un médecin |
| POST | `/api/appointments` | Réserver un créneau |

### Exemple de réservation

```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": 1,
    "patientName": "Jean Dupont",
    "patientEmail": "jean.dupont@email.com"
  }'
```

## Décisions techniques

### Modèle de données

- **Specialty** : Spécialités médicales (Cardiologie, Dermatologie, etc.)
- **Doctor** : Médecins liés à une spécialité
- **TimeSlot** : Créneaux horaires avec champ `bookedBy` nullable (null = disponible)
- **Patient** : Patients créés lors de la réservation

### Gestion de la concurrence

L'**optimistic locking** (`@Version`) sur `TimeSlot` empêche les doubles réservations en cas d'accès concurrent.

### Critères d'acceptation

1. **Un créneau = un patient** : Le champ `bookedBy` assure l'exclusivité
2. **Validation** : Email valide, nom obligatoire
3. **Créneaux futurs uniquement** : Impossible de réserver dans le passé

## Données de test

L'application démarre avec :
- 5 spécialités (Médecine Générale, Cardiologie, Dermatologie, Pédiatrie, Ophtalmologie)
- 6 médecins
- Créneaux pour les 5 prochains jours (9h-12h et 14h-18h)

## Tests

### API Backend
```bash
# Lister les médecins
curl http://localhost:8080/api/doctors

# Voir les créneaux du médecin 1
curl http://localhost:8080/api/doctors/1/slots

# Réserver
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"slotId":1,"patientName":"Test","patientEmail":"test@test.com"}'
```

### Console H2
Accédez à `http://localhost:8080/h2-console` pour explorer la base de données.
- URL JDBC : `jdbc:h2:mem:cabinet_medical`
- User : `sa`
- Password : (vide)
