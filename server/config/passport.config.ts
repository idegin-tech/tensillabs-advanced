import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { prisma } from '../helpers/prisma.helper';
import { comparePassword } from '../helpers/auth.helper';
import { env } from '../helpers/env.helper';
import { AuthProvider } from '@prisma/client';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (user.authProvider !== AuthProvider.EMAIL) {
          return done(null, false, { message: 'Please use social login for this account' });
        }

        if (!user.emailVerified) {
          return done(null, false, { message: 'Please verify your email first' });
        }

        const userSecret = await prisma.userSecret.findUnique({
          where: {
            userId_type: {
              userId: user.id,
              type: 'EMAIL_VERIFICATION',
            },
          },
        });

        if (!userSecret) {
          return done(null, false, { message: 'Account not properly configured' });
        }

        const isValidPassword = await comparePassword(password, userSecret.secret);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value },
          });

          if (user) {
            if (user.authProvider !== AuthProvider.GOOGLE) {
              return done(null, false, { message: 'Email already registered with different provider' });
            }
            return done(null, user);
          }

          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value!,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
              authProvider: AuthProvider.GOOGLE,
              providerId: profile.id,
              emailVerified: new Date(),
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

if (env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: env.MICROSOFT_CLIENT_ID,
        clientSecret: env.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${env.NEXT_PUBLIC_API_URL}/api/v1/auth/microsoft/callback`,
        scope: ['user.read'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value },
          });

          if (user) {
            if (user.authProvider !== AuthProvider.MICROSOFT) {
              return done(null, false, { message: 'Email already registered with different provider' });
            }
            return done(null, user);
          }

          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value!,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
              authProvider: AuthProvider.MICROSOFT,
              providerId: profile.id,
              emailVerified: new Date(),
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { passport };