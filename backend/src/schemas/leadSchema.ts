import { z } from 'zod';
export const leadSchema=z.object({name:z.string().min(2).max(100),email:z.string().email().max(255),company:z.string().max(120).optional().or(z.literal('')),message:z.string().min(5).max(4000)});
