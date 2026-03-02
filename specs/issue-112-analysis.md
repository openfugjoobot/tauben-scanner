# Issue #112 Analysis – Save Button Not Working

## Problem Statement
After commit 0626942 (base64 prefix fix), the "Save Pigeon" button in NewPigeonScreen no longer works. No visible error is shown to the user.

## Root Cause Analysis

### Current Implementation (commit b621ae5)
File: `mobile/src/screens/pigeons/hooks/usePigeonForm.ts`

The `submit` function has these issues:

1. **Silent Error Handling**
   ```typescript
   } catch (error) {
     return false;  // ← Error silently swallowed
   }
   ```
   The catch block returns false but doesn't show any error to the user.

2. **Missing UI Feedback**
   The `submit` function returns false on error, but the consuming component (NewPigeonScreen) doesn't check this return value or display errors.

3. **Form State Issues**
   The `formData.photo` value is a file URI (e.g., `file:///data/...`). When passed to `createMutation.mutateAsync()`, it should be converted to base64 first.
   
   However, the current code:
   - Always calls `convertPhotoToBase64()` if photo exists
   - But `convertPhotoToBase64` might silently fail and return null
   - Then null is passed as `photo` to the API
   - API expects undefined (not null) when no photo

4. **Potential Additional Issues**
   - If `FileSystem.readAsStringAsync` throws, it's caught but the user sees nothing
   - The `isSubmitting` state doesn't reset properly on error

## Comparison with Working State

Commit fd78669 had:
- Direct return: `return \`data:image/jpeg;base64,${base64}\`;`
- This caused a SYNTAX ERROR in the build (backtick escaping issue)

Commit b621ae5 tried to fix with logging but:
- Still has the silent error problem
- Added complexity without solving the UX issue

## Recommendations

### Phase 2: DESIGN
1. **Error UI**: Show toast/snackbar when save fails
2. **State Management**: Properly handle submit loading state
3. **Photo Handling**: 
   - Option A: Skip photo if conversion fails (graceful degradation)
   - Option B: Block submit until photo is ready
4. **Validation**: Add better validation before submit

### Phase 3: PLANNING
Create subtasks:
- #112.1: Add error toast notification
- #112.2: Fix photo null vs undefined handling
- #112.3: Add retry mechanism for save
- #112.4: Test save with/without photo

## Technical Constraints
- Must work with Expo FileSystem API
- Must handle base64 conversion failures gracefully
- Must maintain TypeScript strict mode
- Must not break existing UX flow
