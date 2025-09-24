import { Response, NextFunction } from 'express';
import { SpacesService } from './spaces.service';
import { ValidationRequest } from '../../middleware/validation.middleware';
import { AuthenticatedRequest } from '../auth/auth.middleware';


const spacesService = new SpacesService();

export class SpacesController {
    
}