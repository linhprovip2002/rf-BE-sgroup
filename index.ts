import express from 'express';
import env from 'dotenv';
import routers  from './src/route/index';
const app = express();
app.use(express.json());
env.config();
app.use('/api', routers);
app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});