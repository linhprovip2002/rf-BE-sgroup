import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import routers  from './route/index';
import {errorHandler} from './middleware/index';
import { cacheService } from './service';
import poolKnex from './config/knex';
const app = express();
app.use(cors());
app.use(express.json());
env.config();
poolKnex.raw('select 1+1 as result').then(() => {
  console.log("db connect success");
}).catch((err) => {
  console.log("db connect fail");
})
cacheService.set('test', 1, 'test')
cacheService.get('test', 1).then((res) => {
  console.log("redis connect success");
}).catch((err) => {
  console.log("redis connect fail");
})
app.use('/api', routers);
app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});
app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});