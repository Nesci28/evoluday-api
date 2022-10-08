import {
  AuthApi,
  UserCreate,
  UserRole,
} from "@evoluday/evoluday-api-typescript-fetch";
import * as bcrypt from "bcrypt";

import { Context } from "../../../../test/global";
import { NotificationService } from "../../../services/notification/notification.service";
import { UserRepository } from "../../user/user.repository";
import { AuthRepository } from "../auth.repository";
import { AuthService } from "../auth.service";
import { authForgotPasswordTest } from "./endpoints/auth-forgot.e2e";
import { authLoginTest } from "./endpoints/auth-login.e2e";
import { authRefreshTest } from "./endpoints/auth-refresh.e2e";
import { authResetPasswordTest } from "./endpoints/auth-reset.e2e";

export interface AuthContext extends Context<never, never> {
  authConnector: AuthApi;
  authService: AuthService;
  authRepository: AuthRepository;
  userCreate: UserCreate;
  userRepository: UserRepository;
  notificationService: NotificationService;
}

describe("AuthController", () => {
  const ctx = globalThis.context as AuthContext;

  beforeAll(async () => {
    ctx.authConnector = ctx.testHandler.prepareConnector(AuthApi);
    ctx.authRepository = ctx.testHandler.get("AuthRepository");
    ctx.authService = ctx.testHandler.get("AuthService");
    ctx.userRepository = ctx.testHandler.get("UserRepository");
    ctx.notificationService = ctx.testHandler.get("NotificationService");

    const password = bcrypt.hashSync("password", 10);
    ctx.userCreate = {
      email: "test@test.com",
      password,
      roles: [UserRole.Member],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();
  });

  describe("Auth login", authLoginTest.bind({ ctx }));
  describe("Auth refresh", authRefreshTest.bind({ ctx }));
  describe("Auth forgot password", authForgotPasswordTest.bind({ ctx }));
  describe("Auth reset password", authResetPasswordTest.bind({ ctx }));
});
