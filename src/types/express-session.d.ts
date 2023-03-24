import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    authenticatedUser: {
      userId: string;
      email: string;
    };
    isLoggedIn: boolean;
    logInAttempts: number;
    logInTimeout: Date;
  }
}
