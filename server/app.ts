import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cookieParser from 'cookie-parser';
import { passport } from './config/passport.config';
import { router } from './routes';
import { env } from './helpers/env.helper';

const app = express();

app.use(helmet());
app.use(cors({
    origin: env.NEXT_PUBLIC_URL,
    credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PgSession = connectPgSimple(session);

app.use(session({
    store: new PgSession({
        conString: env.DATABASE_URL,
        tableName: 'sessions',
        createTableIfMissing: true,
    }),
    secret: env.AUTH_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

export { app };
