import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().optional().default(3333),
});

export type Env = z.output<typeof envSchema>;
