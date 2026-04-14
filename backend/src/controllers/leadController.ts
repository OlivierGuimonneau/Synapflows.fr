import { Request, Response } from 'express';
import { leadSchema } from '../schemas/leadSchema';
import { createLead } from '../services/leadService';
export async function leadController(req:Request,res:Response){const parsed=leadSchema.safeParse(req.body);if(!parsed.success){return res.status(400).json({error:'Validation failed',details:parsed.error.flatten()})}try{const result=await createLead(parsed.data);return res.status(201).json({success:true,data:result})}catch{return res.status(500).json({error:'Server error'})}}
