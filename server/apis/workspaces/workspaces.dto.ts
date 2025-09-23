import { z } from 'zod';

export const createWorkspaceDto = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  slug: z.string().min(2, 'Workspace slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export const updateWorkspaceDto = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters').optional(),
  slug: z.string().min(2, 'Workspace slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
});

export const workspaceParamsDto = z.object({
  id: z.string().cuid('Invalid workspace ID'),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceDto>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceDto>;
export type WorkspaceParamsDto = z.infer<typeof workspaceParamsDto>;