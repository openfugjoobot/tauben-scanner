import React from 'react';

// Mock all icon names to return a simple mock component
export const Ionicons = jest.fn(({ name, size, color }: { name: string; size?: number; color?: string }) => 
  React.createElement('Ionicons', { name, size, color, testID: `icon-${name}` })
);

export const MaterialIcons = jest.fn(({ name, size, color }: { name: string; size?: number; color?: string }) => 
  React.createElement('MaterialIcons', { name, size, color, testID: `icon-${name}` })
);

export const FontAwesome = jest.fn(({ name, size, color }: { name: string; size?: number; color?: string }) => 
  React.createElement('FontAwesome', { name, size, color, testID: `icon-${name}` })
);