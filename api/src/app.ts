import express, { Application } from 'express';
import cors from 'cors';
// import routes from './routes/indexRoutes';
import router from './routes/indexRoutes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
dotenv.config();

const server:Application = express();
server.use('/webhook', express.raw({type: "*/*"}));


server.use("/webhook", bodyParser.raw({ type: "*/*" }));
server.use(express.json())//transforma body a json



//midlewares:
server.use((_req: any, _resp: any, next: () => void) => {
  next();
}, cors({ maxAge: 84600 }));

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
// const allowedOrigins = ['*'];

const options: cors.CorsOptions = {
  origin: 'https://artisup.up.railway.app'
  
};

// Then pass these options to cors:
server.use(cors(options));

// server.use(( res: any, ) => {
//   res.header('Access-Control-Allow-Origin', 'https://events-app-eta.vercel.app'); // update to match the domain you will make the request from
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   // next();
// });

server.use('/', router);

export default server;
