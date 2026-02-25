import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number()
    .min(-90, 'Breitengrad muss zwischen -90 und 90 liegen')
    .max(90, 'Breitengrad muss zwischen -90 und 90 liegen'),
  lng: z.number()
    .min(-180, 'Längengrad muss zwischen -180 und 180 liegen')
    .max(180, 'Längengrad muss zwischen -180 und 180 liegen'),
  name: z.string().optional(),
});

export const pigeonSchema = z.object({
  name: z.string()
    .min(2, 'Name muss mindestens 2 Zeichen haben')
    .max(50, 'Name darf maximal 50 Zeichen haben')
    .trim(),
  description: z.string()
    .max(500, 'Beschreibung darf maximal 500 Zeichen haben')
    .optional(),
  photo: z.string()
    .min(1, 'Ein Foto ist erforderlich'),
  location: locationSchema.nullable().optional(),
  isPublic: z.boolean().default(false),
  color: z.enum(['grau', 'weiß', 'schwarz', 'bunt', 'andere']).optional(),
});

export type LocationData = z.infer<typeof locationSchema>;
export type PigeonFormData = z.infer<typeof pigeonSchema>;

// Helper to get field errors from schema
export const validatePigeonForm = (data: unknown): { 
  success: boolean; 
  data?: PigeonFormData; 
  errors?: Record<string, string>; 
} => {
  const result = pigeonSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  
  return { success: false, errors };
};
