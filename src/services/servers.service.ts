import { MemberRole } from "@prisma/client";
import { db } from "../lib/db";
import { v4 as uuidv4 } from "uuid";
interface CreateServerPayload {
  profile: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
  serverName: string;
  serverImageUrl: string;
}

class ServersService {
  async createServer({
    profile,
    serverName,
    serverImageUrl,
  }: CreateServerPayload) {
    try {
      if (!serverName || !serverImageUrl) {
        throw new Error("Name and image URL are required");
      }
      // Create server
      const server = await db.server.create({
        data: {
          name: serverName,
          userId: profile.id,
          image: serverImageUrl,
          inviteCode: uuidv4(),
          channels: {
            create: [{ name: "general", userId: profile.id }],
          },
          members: {
            create: [{ userId: profile.id, role: MemberRole.ADMIN }],
          },
        },
      });
      return server;
    } catch (err) {
      throw new Error("Internal Server Error: " + err);
    }
  }
}

export const serversService = new ServersService();
