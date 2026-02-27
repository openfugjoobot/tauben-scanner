export const requestPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const createAssetAsync = jest.fn(() => 
  Promise.resolve({ uri: 'file://mock-asset.jpg' })
);

export const MediaLibrary = {
  requestPermissionsAsync,
  createAssetAsync,
};