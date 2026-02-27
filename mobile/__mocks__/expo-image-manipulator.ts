export const manipulateAsync = jest.fn(() => 
  Promise.resolve({ uri: 'file://manipulated.jpg' })
);

export const SaveFormat = {
  JPEG: 'jpeg',
  PNG: 'png',
};

export const ImageManipulator = {
  manipulateAsync,
  SaveFormat,
};