import { User } from "@evoluday/evoluday-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "../../modules/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  public async validate(email: string, password: string): Promise<User> {
    const lcEmail = email.toLowerCase();
    const user = await this.authService.login(lcEmail, password);

    return user;
  }
}
