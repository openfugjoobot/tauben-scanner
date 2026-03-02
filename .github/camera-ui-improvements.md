# Feature: Camera UI Improvements

## Zusammenfassung
Verbesserung der Kamera-Ansicht mit Material Design 3, Pinch-to-Zoom und besserer UX.

## Anforderungen

### 1. Pinch-to-Zoom ✅
- [ ] Zwei-Finger-Pinch-Geste für Zoom
- [ ] Flüssige Zoom-Übergänge
- [ ] Mit Slider synchronisieren

### 2. Material Design 3 Styling
- [ ] Elevated Buttons mit Schatten
- [ ] Primary/OnPrimary Farben für Capture-Button
- [ ] Rounded Corners (24px)
- [ ] Surface Variant Hintergründe

### 3. Abbrechen-Button (X)
- [ ] Oben rechts positioniert
- [ ] MD3 Icon Button Style
- [ ] onCancel callback aufrufen

### 4. Zoom-Slider Verbesserungen
- [x] ~~Zoom-Anzeige (1.0x) entfernt~~ ✅ ERLEDIGT
- [x] ~~Kamera-Flip Button entfernt~~ ✅ ERLEDIGT
- [x] ~~Front/Back Badge entfernt~~ ✅ ERLEDIGT
- [ ] Thumb und Track im MD3 Stil

### 5. Responsive Layout
- [ ] Safe Area berücksichtigen
- [ ] Landscape-Modus
- [ ] Verschiedene Bildschirmgrößen

## Offene Punkte (vom aktuellen WIP)
- Pinch-To-Zoom Logik ist unvollständig (nur gestartet)
- MD3 Styling braucht Feinabstimmung
- Abbrechen-Button fehlt noch
- PanResponder events müssen mit Touch events verknüpft werden

## Akzeptanzkriterien
- [ ] Pinch-Zoom funktioniert flüssig
- [ ] UI entspricht MD3 Guidelines
- [ ] Abbrechen-Button ist intuitiv
- [ ] Keine visuellen Glitches auf Android/iOS

## Technische Notes
- PanResponder für Pinch
- Reanimated 2 wäre besser (optional)
- Expo Camera Zoom API: 0-1 Range

## Labels
enhancement, mobile, ui, camera