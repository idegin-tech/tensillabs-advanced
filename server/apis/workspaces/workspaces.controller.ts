import { Response, NextFunction } from 'express';
import { WorkspacesService } from './workspaces.service';
import { ResponseHelper } from '../../helpers/response.helper';
import { AuthenticatedRequest } from '../auth/auth.middleware';

const workspacesService = new WorkspacesService();

export class WorkspacesController {
    
}