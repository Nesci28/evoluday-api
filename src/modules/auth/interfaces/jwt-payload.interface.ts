import { UserRole } from "@evoluday/evoluday-api-typescript-fetch";

export interface JwtPayload {
  userId: string;
  roles: UserRole[];
}
