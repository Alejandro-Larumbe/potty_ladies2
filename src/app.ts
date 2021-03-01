import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import express from 'express'
import errorMiddleware from './middlewares/error.middleware';
import router from './routes/index';
import { HttpException } from './exceptions/HttpException'
import { Request, Response, NextFunction } from 'express'
const port = process.env.PORT

const prisma = new PrismaClient()
const app = express()

app.use(router)


class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => console.log(`🚀 Server ready at: http://localhost:${port}\n⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`));
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      // this.app.use(morgan());
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else if (this.env === 'development') {
      // this.app.use(morgan());
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }


  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;


// app.use((req, res, next) => {
//   const err = new HttpException(404, 'The requested resource couldn\'t be found.', ['The requested resource couldn\'t be found.'], 'The requested resource couldn\'t be found.')

//   next(err)
// });

// app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
//   res.status(err.status || 500);
//   // const isProduction = environment === 'production';
//   const isProduction = true

//   const errorData = {
//     title: err.title || 'Server Error',
//     message: err.message,
//     stack: isProduction ? null : err.stack,
//     errors: err.errors
//   };

//   if (err.status === 401) {
//     res.set('WWW-Authenticate', 'Bearer');
//   }

//   console.error(errorData);
//   res.json(errorData);
// });

// const server = app.listen(port, () =>
//   console.log(
//     `🚀 Server ready at: http://localhost:${port}\n⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`,
//   ),
// )
