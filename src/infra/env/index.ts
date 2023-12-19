import { z } from 'zod';

export const envSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  CLOUDFARE_ACCOUNT_ID: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().int().positive().optional().default(3333),
});

export type Env = z.infer<typeof envSchema>;
