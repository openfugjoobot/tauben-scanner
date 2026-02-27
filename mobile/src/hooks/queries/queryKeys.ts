export const pigeonKeys = {
  all: ['pigeons'] as const,
  lists: () => [...pigeonKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...pigeonKeys.lists(), { filters }] as const,
  details: () => [...pigeonKeys.all, 'detail'] as const,
  detail: (id: string) => [...pigeonKeys.details(), id] as const,
  sightings: (id: string) => [...pigeonKeys.detail(id), 'sightings'] as const,
};

export const matchKeys = {
  all: ['match'] as const,
  result: (imageHash: string) => [...matchKeys.all, 'result', imageHash] as const,
};
