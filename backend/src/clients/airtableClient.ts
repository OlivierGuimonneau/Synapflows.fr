import Airtable from 'airtable';
import { env } from '../config/env';
export function getAirtableBase(){if(!env.airtableToken || !env.airtableBaseId){throw new Error('Missing Airtable configuration')}Airtable.configure({apiKey:env.airtableToken});return Airtable.base(env.airtableBaseId)}
