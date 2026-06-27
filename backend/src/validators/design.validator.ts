import { z } from 'zod';

export const designSchema = z.object({
    problemId: z.string().min(1, 'Problem ID is required'),
    name: z.string().optional(),
    nodes: z.array(z.any()).default([]),
    edges: z.array(z.any()).default([]),
});

export type DesignInput = z.infer<typeof designSchema>;
