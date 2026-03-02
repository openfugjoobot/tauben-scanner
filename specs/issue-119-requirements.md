# REQUIREMENTS.md – Database Seed Script

## Issue: #119

## Ziel
Datenbank-Seed-Skript mit 6 realistischen Test-Tauben für Entwicklung und Demos.

## Test-Tauben (6 Stück)

### Taube 1
- **Name:** Heidi
- **Beschreibung:** Rote Fußringe, sehr zutraulich, hängt oft am Hauptbahnhof
- **Koordinaten:** 46.4983°, 11.3547° (Südtirol, Bozen)

### Taube 2
- **Name:** Franz
- **Beschreibung:** Graue Federn mit weißem Streifen, ängstlich, lebt im Park
- **Koordinaten:** 46.4989°, 11.3498° (Südtirol, Waltherplatz)

### Taube 3
- **Name:** Greta
- **Beschreibung:** Schwarz-weiß gescheckt, frisst aus der Hand, bekannt im Einkaufszentrum
- **Koordinaten:** 46.4975°, 11.3562° (Südtirol, Europark)

### Taube 4
- **Name:** Otto
- **Beschreibung:** Große braune Taube mit grünem Hals, sehr dominant
- **Koordinaten:** 46.5002°, 11.3510° (Südtirol, Talferwiesen)

### Taube 5
- **Name:** Leni
- **Beschreibung:** Kleine weiße Taube, oft mit anderen Jungtieren unterwegs
- **Koordinaten:** 46.4968°, 11.3535° (Südtirol, Universitätsplatz)

### Taube 6
- **Name:** Max
- **Beschreibung:** Beringte Stadt-Taube, wird regelmäßig gesichtet im Stadtpark
- **Koordinaten:** 46.4995°, 11.3487° (Südtirol, Palais-Sparkasse)

## Technische Anforderungen

| Feld | Anforderung |
|------|-------------|
| `name` | Echte Namen (Heidi, Franz, Greta, Otto, Leni, Max) |
| `description` | Sinnvolle Beschreibung (Federn, Verhalten, Ort) |
| `location.lat` | Realistische Südtirol-Koordinaten (± Bozen) |
| `location.lng` | Realistische Südtirol-Koordinaten (± Bozen) |
| `location.name` | Ortsname (z.B. "Bozen Hauptbahnhof") |
| `photo` | Bild aus samples/ (base64 mit data:image/jpeg prefix) |
| `is_public` | true (für Testdaten) |

## Features

### Required
- [ ] 6 Tauben mit allen Feldern befüllt
- [ ] Idempotent (bei erneutem Ausführen überspringen oder updaten)
- [ ] Ausgabe: "Erstellt: Heidi in Bozen Hauptbahnhof"
- [ ] Fehlerbehandlung: Log statt Abbruch

### Optional
- [ ] Überprüfung: Nach Seed ein Match-Test machen (ein Bild muss sich selbst finden)
- [ ] Lösch-Modus: `--reset` zum Entfernen aller Testtauben

## Akzeptanzkriterien

1. `npm run seed` erstellt alle 6 Tauben
2. Alle Bilder sind in `/uploads/` gespeichert
3. Alle Embeddings sind 1024-Dimensionen
4. API `GET /api/pigeons` zeigt alle 6 an
5. Similarity-Search findet passende Taube mit >80% Konfidenz

## Implementation

**Skript:** `backend/src/scripts/seedDatabase.ts`
**Aufruf:** `npm run seed`
**Dauer:** ~30 Sekunden (6× Embeddings)
**Dependencies:** backend/src/services/embedding.ts (reuse)
