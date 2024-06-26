if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';


import depositeroute from './controller/deposite';
import userRoute from './controller/user';
import transferroute from './controller/transfer';
import withdrawroute from './controller/withdraw';
import transactionroute from './controller/transaction';

const app = express();

app.use(cors({
  credentials: true,
  origin: true 
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


app.use('/api', depositeroute);
app.use('/api', userRoute);
app.use('/api', withdrawroute);
app.use('/api', transferroute);
app.use('/api', transactionroute);


const port = process.env.PORT || 8000; 

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
