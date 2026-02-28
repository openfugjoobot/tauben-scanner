# REQUIREMENTS.md - CameraCapture Component Fixes

**Project:** tauben-scanner  
**Issue Type:** Bug Fix / Enhancement  
**Priority:** P1-High  
**Created:** 2026-02-28  

---

## 1. Project Goal

Fix the CameraCapture component UI/UX and functionality issues to ensure proper camera operation and user experience.

---

## 2. Problem Statement

The current CameraCapture component has three critical issues:

### Issue 1: UI Overlay Problem
- **Description:** Buttons and UI controls appear to be positioned under an overlay, making them partially inaccessible or poorly visible
- **Impact:** Users cannot properly interact with camera controls

### Issue 2: Zoom Control Not Working  
- **Description:** The zoom slider/control does not adjust the camera zoom level
- **Impact:** Users cannot zoom in/out when photographing pigeons

### Issue 3: Wrong Camera After Capture
- **Description:** After taking a photo, the image is captured from a different camera (not the primary/rear camera) than what was displayed
- **Impact:** Wrong image quality, front camera used instead of rear camera

---

## 3. User Stories

1. **As a user,** I want to clearly see and interact with all camera controls so that I can easily take photos.
2. **As a user,** I want the zoom slider to actually zoom the camera so that I can frame my shots better.
3. **As a user,** I want the captured photo to match what I see in the preview so that I get the correct image.

---

## 4. Technical Context

**Current Implementation:**
- Component: `mobile/src/components/organisms/CameraCapture/`
- Camera library: `expo-camera` (Expo SDK 52)
- Platform: Android (API 24+)

**Expected Behavior:**
- UI overlay z-index: Controls should be on TOP of camera preview
- Zoom: Should use `zoom` prop of expo-camera
- Camera type: Should consistently use `back` camera type

---

## 5. Acceptance Criteria

- [ ] All buttons and UI elements are clearly visible and clickable
- [ ] Zoom slider adjusts camera zoom in real-time
- [ ] Captured image uses the same camera (rear) as the preview
- [ ] Tested on physical Android device
- [ ] No regression in existing camera features

---

## 6. Deliverables

1. Fixed CameraCapture component
2. Updated CameraControls component (zoom fix)
3. Updated PhotoPreview component
4. E2E test or manual test checklist

---

## 7. Exclusions

- No iOS-specific fixes (Android primary)
- No changes to camera permissions flow
- No changes to image processing backend

---

## 8. Definition of Done

- [ ] PR created with fixes
- [ ] Code reviewed by QAAgent
- [ ] Manual test on device successful
- [ ] All acceptance criteria met
- [ ] Documentation updated if needed

---

**Confirmed by:** Ivan  
**Date:** 2026-02-28  
