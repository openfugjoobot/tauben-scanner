// Type-safe icon names for MaterialCommunityIcons
export const AppIcons = {
  home: 'home',
  pigeon: 'bird',
  scan: 'qrcode-scan',
  sightings: 'map-marker-radius',
  settings: 'cog',
  add: 'plus',
  camera: 'camera',
  image: 'image',
  check: 'check-circle',
  alert: 'alert-circle',
  error: 'close-circle',
  back: 'arrow-left',
  chevronRight: 'chevron-right',
  search: 'magnify',
  filter: 'filter-variant',
  delete: 'trash-can-outline',
  edit: 'pencil-outline',
  info: 'information-outline',
  map: 'map-outline',
  sync: 'sync',
  cloud: 'cloud-upload-outline',
  location: 'crosshairs-gps',
} as const;

export type AppIconName = keyof typeof AppIcons;
export type MaterialIconName = (typeof AppIcons)[AppIconName];
