import * as express from 'express';
import { authenticate } from './middleware/requireAuth';
import router from "./routes/routes";

const app = express();

app.use(authenticate);
app.use(router);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
