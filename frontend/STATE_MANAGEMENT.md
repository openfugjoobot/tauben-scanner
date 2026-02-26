# T3: State Management - Dokumentation

## Übersicht

Dieses Modul implementiert State Management mit **Zustand** + **React Query** + **MMKV** für die Tauben Scanner App.

## Installierte Dependencies

```bash
npm install zustand @tanstack/react-query @tanstack/react-query-devtools react-native-mmkv
```

## Architektur

```
┌─────────────────────────────────────────────┐
│              React Components                │
├─────────────────────────────────────────────┤
│  useApp / useScan / useSettings (Hooks)     │
├─────────────────────────────────────────────┤
│  AppStore / ScanStore / SettingsStore       │
│  (Zustand mit Persistenz)                   │
├─────────────────────────────────────────────┤
│  MMKV (React Native) / localStorage (Web)    │
├─────────────────────────────────────────────┤
│  usePigeons / useSightings / useMatchImage  │
│  (React Query mit Caching)                  │
└─────────────────────────────────────────────┘
```

## Stores

### AppStore

```typescript
import {useApp, useTheme, useIsDarkMode, useIsOnline} from './stores';

function MyComponent() {
  const {theme, isDarkMode, toggleTheme, setOnlineStatus} = useApp();
  const isOnline = useIsOnline();
  const currentTheme = useTheme();
  
  return (
    <div>
      <button onClick={toggleTheme}>Theme: {theme}</button>
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}
```

**State:**
- `theme`: 'light' | 'dark' | 'system'
- `isDarkMode`: boolean
- `isOnline`: boolean
- `language`: string
- `onboardingCompleted`: boolean
- `appVersion`: string

**Persistiert:** theme, language, onboardingCompleted, appVersion

### ScanStore

```typescript
import {useScan, useScanStatus, createScanResult} from './stores';

function ScanComponent() {
  const {
    status,
    capturedPhoto,
    result,
    setCapturedPhoto,
    setResult,
    resetScan,
    addToHistory,
    isScanning,
  } = useScan();
  
  const handleScanComplete = async (scanResult) => {
    const result = createScanResult({
      confidence: scanResult.confidence,
      pigeonId: scanResult.pigeonId,
    });
    
    setResult(result);
    addToHistory(result);
  };
  
  return (
    <div>
      {isScanning && <Spinner />}
      {status === 'error' && <ErrorView />}
    </div>
  );
}
```

**State:**
- `status`: 'idle' | 'capturing' | 'uploading' | 'processing' | 'completed' | 'error'
- `capturedPhoto`: string | null (base64)
- `location`: {latitude, longitude, accuracy, timestamp} | null
- `result`: ScanResult | null
- `error`: string | null
- `scanHistory`: ScanResult[]

**Persistiert:** nur `scanHistory`

### SettingsStore

```typescript
import {useSettings, useApiUrl, useMatchThreshold} from './stores';

function SettingsComponent() {
  const {
    apiUrl,
    matchThreshold,
    setApiUrl,
    setMatchThreshold,
    toggleDebugMode,
    resetSettings,
  } = useSettings();
  
  const api = useApiUrl();
  
  return (
    <div>
      <input 
        value={apiUrl} 
        onChange={(e) => setApiUrl(e.target.value)} 
      />
      <button onClick={resetSettings}>Reset</button>
    </div>
  );
}
```

**State:**
- `apiUrl`: string
- `apiKey`: string | null
- `userName`: string
- `userEmail`: string
- `notificationsEnabled`: boolean
- `autoSync`: boolean
- `matchThreshold`: number (0-100)
- `savePhotos`: boolean
- `compressPhotos`: boolean
- `debugMode`: boolean
- `cacheDuration`: number (Minuten)

**Persistiert:** Alle Settings

## React Query Hooks

### Pigeon Queries

```typescript
import {
  usePigeons,
  usePigeon,
  useCreatePigeon,
  useUpdatePigeon,
  useDeletePigeon,
} from './hooks';

function PigeonList() {
  const {data: pigeons, isLoading, error} = usePigeons();
  const {mutate: createPigeon, isPending} = useCreatePigeon();
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <ul>
      {pigeons?.map(pigeon => (
        <li key={pigeon.id}>{ppigeon.name}</li>
      ))}
    </ul>
  );
}
```

### Sighting Queries

```typescript
import {
  useSightings,
  useSightingsByPigeon,
  useCreateSighting,
} from './hooks';

function PigeonSightings({pigeonId}: {pigeonId: string}) {
  const {data: sightings} = useSightingsByPigeon(pigeonId);
  const {mutate: createSighting} = useCreateSighting();
  
  const handleAddSighting = () => {
    createSighting({
      pigeonId,
      location: {latitude, longitude},
      photoUrl,
      notes,
    });
  };
  
  return (...);
}
```

### Match/Scan Hook

```typescript
import {useMatchImage} from './hooks';

function ScanPage() {
  const {mutate: matchImage, data, isPending, error} = useMatchImage();
  
  const handleScan = async (imageBase64: string) => {
    matchImage({
      imageBase64,
      threshold: 75,
    }, {
      onSuccess: (result) => {
        console.log('Match:', result.pigeon, result.confidence);
      },
      onError: (error) => {
        console.error('Scan failed:', error);
      },
    });
  };
  
  return (...);
}
```

## Query Client Konfiguration

Der Query Client wird in `src/main.tsx` initialisiert:

```typescript
import {QueryProvider} from './components/providers/QueryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
```

**Default Options:**
- `staleTime`: 5 Minuten
- `gcTime`: 10 Minuten
- `retry`: 3 Versuche
- `refetchOnWindowFocus`: true
- `refetchOnReconnect`: true

## TypeScript Interfaces

Siehe `src/types/store.ts`:

```typescript
interface AppState {
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  isOnline: boolean;
  lastOnlineCheck: number | null;
  language: string;
  onboardingCompleted: boolean;
  appVersion: string;
}

interface ScanState {
  status: ScanStatus;
  capturedPhoto: string | null;
  location: {...} | null;
  result: ScanResult | null;
  error: string | null;
  scanHistory: ScanResult[];
}

interface SettingsState {
  apiUrl: string;
  apiKey: string | null;
  userName: string;
  userEmail: string;
  notificationsEnabled: boolean;
  autoSync: boolean;
  matchThreshold: number;
  savePhotos: boolean;
  compressPhotos: boolean;
  debugMode: boolean;
  cacheDuration: number;
}
```

## Persistenz

### MMKV (React Native)

- Verschlüsselter Storage mit `id: 'tauben-scanner-storage'`
- Automatic Rehydration beim App-Start

### localStorage (Web)

- Fallback für Web-Version
- Keine Verschlüsselung

## Cache Invalidierung

```typescript
import {invalidatePigeonQueries, invalidateSightingQueries} from './services/queryClient';

// Nach einem Update alle Tauben-Queries invalidieren
await invalidatePigeonQueries();

// Oder spezifische Query
await invalidateQueries(['pigeons', id]);
```

## React Query DevTools

In der Entwicklungsumgebung (DEV) werden automatisch React Query DevTools eingeblendet (nur im Web).

## Migration von bestehendem Code

Die alten Context-Hooks funktionieren weiterhin, können aber nach und nach durch Store-Hooks ersetzt werden:

| Alte Hook | Neue Hook |
|-----------|-----------|
| `useSettingsHook()` | `useSettings()` |
| `useAddPigeonForm()` | Wird durch ScanStore ersetzt |
| `useTheme` | `useApp()` |

## Testing

```typescript
import {mmkvStorage, clearAllStorage} from './stores';

// Storage vor Test leeren
beforeEach(() => {
  clearAllStorage();
});

// Store in Test zurücksetzen
import {useAppStore, useSettingsStore} from './stores';

beforeEach(() => {
  useAppStore.getState().setTheme('light');
  useSettingsStore.getState().resetSettings();
});
```
