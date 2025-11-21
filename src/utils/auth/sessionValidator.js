import { ConnectDb } from "@/app/helpers/DB/db";
import Session from "@/app/helpers/models/Session";

export async function validateSession(token) {
  await ConnectDb();

  const session = await Session.findOne({ token }).populate("userId");

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.userId;
}
