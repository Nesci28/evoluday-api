import {
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  JwtTokenPayload,
  LoginRequestBody,
  LoginResponse,
  RefreshResponse,
  ResetPasswordRequestBody,
  ResetPasswordResponse,
  User,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Body, Controller, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import {
  LocalPayload,
  RefreshPayload,
  RefreshTokenGuard,
  UserAgent,
  UserAgentInfo,
} from "@yest/security";

import { LocalGuard } from "../../passport/local/local.guard";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  public async login(
    @LocalPayload() user: User,
    @UserAgent() userAgent: UserAgentInfo,
    @Body() loginRequestBody: LoginRequestBody,
  ): Promise<LoginResponse> {
    const { rememberMe } = loginRequestBody;
    const jwt = await this.authService.generateJwtPayload(user);

    const refreshToken = this.authService.signRefreshToken(user.id, rememberMe);

    await this.authService.addRefreshTokenToUser(user.id, {
      token: refreshToken,
      ...userAgent,
    });

    return ResultHandler.ok({ jwt, refreshToken });
  }

  @UseGuards(RefreshTokenGuard)
  public async refreshToken(
    @RefreshPayload()
    refreshPayload: {
      refreshToken: string;
      user: JwtTokenPayload;
    },
    @UserAgent() userAgent: UserAgentInfo,
  ): Promise<RefreshResponse> {
    const { refreshToken, user: userPayload } = refreshPayload;
    const { userId } = userPayload;

    await this.authService.verifyRefreshToken(refreshToken);

    const user = await this.authService.validateUserByRefreshToken(
      userId,
      refreshToken,
    );

    const decodedRefreshToken =
      this.authService.decodeRefreshToken(refreshToken);
    const diffInSeconds = decodedRefreshToken.exp - decodedRefreshToken.iat;
    const rememberMe = diffInSeconds > 60 * 60 * 1 + 1;

    const updatedRefreshToken = this.authService.signRefreshToken(
      user.id,
      rememberMe,
    );
    await this.authService.addRefreshTokenToUser(userId, {
      token: updatedRefreshToken,
      ...userAgent,
    });

    const jwt = await this.authService.generateJwtPayload(user);

    const value = { jwt, refreshToken: updatedRefreshToken };
    return ResultHandler.ok(value);
  }

  public async forgotPassword(
    @Body() forgotPasswordRequestBody: ForgotPasswordRequestBody,
  ): Promise<ForgotPasswordResponse> {
    const { email } = forgotPasswordRequestBody;
    const forgotPasword = await this.authService.forgotPassword(email);

    return ResultHandler.ok(forgotPasword);
  }

  public async resetPassword(
    @Body() resetPasswordRequestBody: ResetPasswordRequestBody,
  ): Promise<ResetPasswordResponse> {
    const resetPasword = await this.authService.resetPassword(
      resetPasswordRequestBody,
    );

    return ResultHandler.ok(resetPasword);
  }
}
