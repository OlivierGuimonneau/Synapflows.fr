import express from 'express';
import cors from 'cors';
import path from 'node:path';
import routes from './routes';
import { env } from './config/env';
import { securityHeaders } from './middleware/securityHeaders';
const app=express();app.disable('x-powered-by');app.use(securityHeaders);app.use(cors({origin:env.corsOrigins,methods:['GET','POST','OPTIONS']}));app.use(express.json());app.use('/api',routes);const frontendDistPath=path.resolve(process.cwd(),'frontend-dist');app.use(express.static(frontendDistPath));app.get('*',(_req,res)=>{res.sendFile(path.join(frontendDistPath,'index.html'))});app.listen(env.port,()=>{console.log(`Server listening on port ${env.port}`)});
