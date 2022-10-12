import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/indexRoutes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
dotenv.config();

const server:Application = express();
server.use('/webhook', express.raw({type: "*/*"}));

console.log(routes);

server.use("/webhook", bodyParser.raw({ type: "*/*" }));
server.use(express.json())//transforma body a json



//midlewares:
server.use((_req: any, _resp: any, next: () => void) => {
  next();
}, cors({ maxAge: 84600 }));

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['*'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
  
};

// Then pass these options to cors:
server.use(cors(options));

server.use('/', routes);

export default server;