import dotenv from 'dotenv';
dotenv.config();
export const env={nodeEnv:process.env.NODE_ENV ?? 'development',port:Number(process.env.PORT ?? 5000),corsOrigins:(process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174').split(','),airtableToken:process.env.AIRTABLE_TOKEN ?? '',airtableBaseId:process.env.AIRTABLE_BASE_ID ?? '',airtableTableName:process.env.AIRTABLE_TABLE_NAME ?? 'Leads',siteDomain:process.env.APP_DOMAIN ?? 'www.synapflows.fr'};
