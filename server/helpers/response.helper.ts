import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  payload?: T;
  code?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  errors?: any[];
  timestamp: string;
}

export class ResponseHelper {
  private static createResponse<T>(
    success: boolean, 
    message: string, 
    payload?: T, 
    code?: string
  ): ApiResponse<T> | ApiError {
    const response = {
      success,
      message,
      timestamp: new Date().toISOString(),
    };

    if (success && payload !== undefined) {
      return { ...response, payload } as ApiResponse<T>;
    }

    if (!success && code) {
      return { ...response, code } as ApiError;
    }

    return response as ApiResponse<T>;
  }

  static success<T>(
    res: Response, 
    message: string, 
    payload?: T, 
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json(
      this.createResponse(true, message, payload)
    );
  }

  static created<T>(
    res: Response, 
    message: string, 
    payload?: T
  ): Response {
    return this.success(res, message, payload, 201);
  }

  static error(
    res: Response, 
    message: string, 
    statusCode: number = 400, 
    code?: string,
    errors?: any[]
  ): Response {
    const errorResponse = this.createResponse(false, message, undefined, code) as ApiError;
    if (errors) {
      errorResponse.errors = errors;
    }
    return res.status(statusCode).json(errorResponse);
  }

  static badRequest(
    res: Response, 
    message: string = 'Bad request', 
    code?: string,
    errors?: any[]
  ): Response {
    return this.error(res, message, 400, code, errors);
  }

  static unauthorized(
    res: Response, 
    message: string = 'Unauthorized', 
    code?: string
  ): Response {
    return this.error(res, message, 401, code);
  }

  static forbidden(
    res: Response, 
    message: string = 'Forbidden', 
    code?: string
  ): Response {
    return this.error(res, message, 403, code);
  }

  static notFound(
    res: Response, 
    message: string = 'Not found', 
    code?: string
  ): Response {
    return this.error(res, message, 404, code);
  }

  static conflict(
    res: Response, 
    message: string = 'Conflict', 
    code?: string
  ): Response {
    return this.error(res, message, 409, code);
  }

  static internalError(
    res: Response, 
    message: string = 'Internal server error', 
    code?: string
  ): Response {
    return this.error(res, message, 500, code);
  }

  static validationError(
    res: Response, 
    message: string = 'Validation failed', 
    errors: any[]
  ): Response {
    return this.error(res, message, 422, 'VALIDATION_ERROR', errors);
  }
}

export { ResponseHelper as ApiResponseHelper };