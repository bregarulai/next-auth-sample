import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

let userAccount = null;

export default (req, res) =>
  NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
          console.log("credentials", credentials);
          await dbConnect();

          const result = await User.findOne({ username: credentials.username });

          if (!result) {
            throw new Error(`User ${credentials.username} not found!`);
          }
          const checkedPassword = await compare(
            credentials.password,
            result.password
          );

          if (!checkedPassword) {
            throw new Error("Invalid credentials");
          }

          const { createdAt, updatedAt, password, ...info } = result._doc;
          userAccount = info;
          return { user: info };
        },
      }),
    ],

    session: {
      strategy: "jwt",
      jwt: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    database: process.env.MONGOOSE_URL,
    jwt: {
      secret: process.env.SECRET,
      encryption: true,
    },

    pages: {
      signIn: "/auth/signin", // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        return user;
      },
      async session({ session, token, user }) {
        if (userAccount !== null) {
          session.user = userAccount;
        }
        session.token = token;
        return session;
      },
      async redirect({ url, baseUrl }) {
        return baseUrl;
      },

      async jwt({ token, user, account, profile, isNewUser }) {
        token.user = userAccount;
        return token;
      },
    },

    events: {},
    theme: {
      colorScheme: "light",
    },

    // Enable debug messages in the console if you are having problems
    debug: false,
  });
