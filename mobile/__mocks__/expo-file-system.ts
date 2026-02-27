export const documentDirectory = 'file://documents/';
export const cacheDirectory = 'file://cache/';

export const readAsStringAsync = jest.fn(() => Promise.resolve('base64data'));
export const writeAsStringAsync = jest.fn(() => Promise.resolve());
export const deleteAsync = jest.fn(() => Promise.resolve());
export const getInfoAsync = jest.fn(() => Promise.resolve({ exists: true }));

export const FileSystem = {
  documentDirectory,
  cacheDirectory,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  getInfoAsync,
};