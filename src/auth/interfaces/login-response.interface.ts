import { User } from "@/users/entities/user.entity";

export interface LoginResponseInterface extends Readonly<{
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}> {}
