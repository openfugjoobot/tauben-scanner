# REQUIREMENTS.md – Tauben Scanner App Fixes

## Current Scope (Backend-Abhängigkeit)
#103 (PigeonEdit) ist BLOCKED – Backend hat keine PUT Route.
Aktueller Scope: #102 und #104 only.

## Project Goal
Repariere kritische Flows in der Tauben Scanner Mobile App.

## User Stories

1. **Als User** möchte ich nach einem Scan ohne Treffer **direkt eine neue Taube mit dem aufgenommenen Foto anlegen**, damit ich keine Zeit verliere mit manuellem Upload.

2. **Als Developer** möchte ich **keine any-Typen oder Console-Logs im Production-Code**, damit die App wartbar bleibt.

## Tech Stack
- React Native 0.76.9
- Expo SDK 52
- TypeScript 5.9
- React Navigation 7.x
- Zustand, TanStack Query

## Active Deliverables

### #102: Fix NewPigeon Navigation (IN SCOPE)
- [ ] ResultsScreen → PigeonsFlow/NewPigeon navigieren
- [ ] PhotoUri vom Scan übergeben (prop drilling)
- [ ] Button aktivieren + handler implementieren
- [ ] Navigation nach Speichern (goBack oder Home)

### #104: Code Cleanup (IN SCOPE)
- [ ] 15x console.log entfernen
- [ ] 4x useNavigation<any> typisieren
- [ ] API URL via EXPO_PUBLIC_API_URL
- [ ] 1x @ts-ignore beheben

## BLOCKED (Future)

### #103: PigeonEditScreen
**Grund:** Backend hat keine PUT /api/pigeons/:id Route.
**Voraussetzung:** Backend endpoint implementieren.

## Exclusions
- Keine Backend-Änderungen (außer #103 Blocker)
- Kein UI-Redesign
- Keine Performance-Optimierungen

## Success Criteria
- [ ] Scan → Kein Treffer → Neue Taube → Foto sichtbar → Speichern funktioniert
- [ ] npm run typecheck: 0 Errors
- [ ] Keine console.log in Production
- [ ] GitHub Actions Build grün

## Estimation (aktuell)
- #102: 2-3h (Navigation, Photo-Prop)
- #104: 2h (Refactoring)

## Sub-Issues
- #102: Fix NewPigeon Navigation from Scan Results (OPEN)
- #103: Implement PigeonEditScreen (CLOSED - BLOCKED)
- #104: Code Cleanup – Logs, Types, API URL (OPEN)

## Parent Issue
#101: App Bug Fixes & Incomplete Flows
