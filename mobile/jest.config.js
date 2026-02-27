module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
        skipLibCheck: true,
        noEmit: true,
        strict: false,
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.ts',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.ts',
    '^expo-camera$': '<rootDir>/__mocks__/expo-camera.ts',
    '^expo-location$': '<rootDir>/__mocks__/expo-location.ts',
    '^expo-media-library$': '<rootDir>/__mocks__/expo-media-library.ts',
    '^@react-native-community/slider$': '<rootDir>/__mocks__/slider.ts',
    '^react-native-maps$': '<rootDir>/__mocks__/react-native-maps.ts',
    '^expo-file-system$': '<rootDir>/__mocks__/expo-file-system.ts',
    '^expo-image-manipulator$': '<rootDir>/__mocks__/expo-image-manipulator.ts',
    '^@expo/vector-icons$': '<rootDir>/__mocks__/vector-icons.ts',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/__mocks__/',
  ],
  verbose: true,
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@tanstack)/)',
  ],
};