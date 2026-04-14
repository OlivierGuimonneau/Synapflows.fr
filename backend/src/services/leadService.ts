import { getAirtableBase } from '../clients/airtableClient';
import { env } from '../config/env';
import { z } from 'zod';
import { leadSchema } from '../schemas/leadSchema';
export type LeadInput=z.infer<typeof leadSchema>;
export async function createLead(input:LeadInput){const base=getAirtableBase();const records=await base(env.airtableTableName).create([{fields:{Name:input.name,Email:input.email,Company:input.company || '',Message:input.message,SourceDomain:env.siteDomain}}]);return {id:records[0].id}}
