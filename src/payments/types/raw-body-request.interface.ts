// src/payments/types/raw-body-request.interface.ts
import { Request } from 'express';

export interface RawBodyRequest extends Request {
  rawBody: Buffer;
}
