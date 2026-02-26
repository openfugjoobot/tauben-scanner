export const getForegroundPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'undetermined' })
);

export const requestForegroundPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const getCurrentPositionAsync = jest.fn(() => 
  Promise.resolve({
    coords: { latitude: 52.52, longitude: 13.405 },
  })
);

export const Location = {
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
};