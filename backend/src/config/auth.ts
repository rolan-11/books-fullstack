import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Falta la variable MONGODB_URI en el archivo .env");
}

const client = new MongoClient(uri);
const db = client.db();

const hasGitHub =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  process.env.GITHUB_CLIENT_ID !== "pendiente" &&
  Boolean(process.env.GITHUB_CLIENT_SECRET) &&
  process.env.GITHUB_CLIENT_SECRET !== "pendiente";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5173",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:5173",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
  },
  ...(hasGitHub
    ? {
        socialProviders: {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});