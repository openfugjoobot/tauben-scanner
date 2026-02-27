import React from 'react';

export const MapView = jest.fn(({ children }: { children: React.ReactNode }) => children);
export const Marker = jest.fn(({ children }: { children: React.ReactNode }) => children);
export const PROVIDER_GOOGLE = 'google';

export default MapView;