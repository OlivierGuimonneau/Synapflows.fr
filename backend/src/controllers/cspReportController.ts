import { Request, Response } from 'express';
export function cspReportController(req:Request,res:Response){console.log('CSP report',req.body);res.status(204).send()}
