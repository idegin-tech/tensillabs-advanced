import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { prisma } from '../helpers/prisma.helper';
import { comparePassword } from '../helpers/auth.helper';

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

        if (!user.emailVerified) {
          return done(null, false, { message: 'Please verify your email first' });
        }

        const userWithSecret = await prisma.user.findUnique({
          where: { id: user.id },
          include: { userSecret: true }
        });

        if (!userWithSecret?.userSecret?.hashedPassword) {
          return done(null, false, { message: 'Account not properly configured' });
        }

        const isValidPassword = await comparePassword(password, userWithSecret.userSecret.hashedPassword);

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