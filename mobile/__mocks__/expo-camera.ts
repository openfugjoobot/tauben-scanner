export const Camera = {
  getCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'undetermined' })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
};

export const CameraType = {
  back: 'back',
  front: 'front',
};

export const FlashMode = {
  on: 'on',
  off: 'off',
  auto: 'auto',
  torch: 'torch',
};

export const CameraView = jest.fn(() => null);