import { date, ipv4, string, z } from "zod";

export const UserRefreshPayloadSchema = z.object({
  ip: ipv4(),
  device: string().min(1),
  createdAt: date(),
});
