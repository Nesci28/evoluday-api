import {
  AdvancedOperator,
  DecodedRefreshToken,
  ForgotPassword,
  ForgotPasswordCreate,
  ForgotPasswordSearch,
  JwtTokenPayload,
  RefreshToken,
  ResetPasswordRequestBody,
  User,
  UserPatch,
  UserSearch,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BasicOperator } from "@yest/contract";
import { InternalServerException, ResultHandlerException } from "@yest/router";
import { BaseAuthPayload } from "@yest/security";
import * as bcrypt from "bcrypt";
import * as generator from "generate-password";
import { remove, unset } from "lodash";

import { configs } from "../../constants/configs.constant";
import { Transactionnal } from "../../decorators/transactionnal.decorator";
import { NotificationService } from "../../services/notification/notification.service";
import { DateUtil } from "../../utils/date.util";
import { UserService } from "../user/user.service";
import { AuthErrors } from "./auth.errors";
import { AuthRepository } from "./auth.repository";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @Inject("YestJwtService") private readonly jwtService: JwtService,
    @Inject("YestRefreshLongService")
    private readonly refreshLongService: JwtService,
    @Inject("YestRefreshShortService")
    private readonly refreshShortService: JwtService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly authRepository: AuthRepository,
  ) {}

  @Transactionnal()
  public async resetPassword(
    resetPasswordRequestBody: ResetPasswordRequestBody,
  ): Promise<boolean> {
    const fifteenMinAgo = DateUtil.addToDate(new Date(), -15, "minutes");
    const { token, email, password, confirmedPassword } =
      resetPasswordRequestBody;

    const arePasswordsEqual = password === confirmedPassword;
    if (!arePasswordsEqual) {
      throw new ResultHandlerException(AuthErrors.passwordsDontMatch);
    }

    const forgotPasswordSearch: ForgotPasswordSearch = {
      pagination: {
        limit: 1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        { token: [{ operator: BasicOperator.Equal, values: [token] }] },
        {
          email: [{ operator: BasicOperator.Equal, values: [email] }],
        },
        {
          date: [
            {
              operator: AdvancedOperator.GreaterThanEqual,
              values: [fifteenMinAgo],
            },
          ],
        },
        {
          date: [
            {
              operator: AdvancedOperator.LesserThanEqual,
              values: [new Date()],
            },
          ],
        },
      ],
    };
    const forgotPasswords = await this.authRepository.search(
      forgotPasswordSearch,
    );
    if (
      forgotPasswords.value.length !== 1 ||
      forgotPasswords.pagination.totalItems !== 1
    ) {
      throw new ResultHandlerException(AuthErrors.tokenInvalid);
    }
    const [forgotPassword] = forgotPasswords.value;

    const userSearch: UserSearch = {
      pagination: {
        limit: 1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          email: [{ operator: BasicOperator.Equal, values: [email] }],
        },
      ],
    };
    const users = await this.userService.search(userSearch);
    if (users.value.length !== 1 || users.pagination.totalItems !== 1) {
      throw new ResultHandlerException(AuthErrors.invalidUser);
    }
    const [user] = users.value;

    const passwordHashed = bcrypt.hashSync(password, 10);
    const userPatch: UserPatch = {
      password: passwordHashed,
    };
    await this.userService.patch(user.id, userPatch);

    await this.authRepository.archive(forgotPassword.id);

    return true;
  }

  public async forgotPassword(email: string): Promise<ForgotPassword> {
    const userSearch: UserSearch = {
      pagination: {
        limit: 1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          email: [
            {
              operator: BasicOperator.Equal,
              values: [email],
            },
          ],
        },
      ],
    };
    const userSearchApi = await this.userService.search(userSearch);
    const users = userSearchApi.value!;
    if (!users.length) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }

    const token = this.generateToken();
    const forgotPasswordCreate: ForgotPasswordCreate = {
      email,
      token,
    };
    const forgotPasswordCreateApi = await this.authRepository.create(
      forgotPasswordCreate,
    );

    await this.notificationService.sendEmail({
      email,
      subject: "Forgot you password?  Oublier votre mot de passe?",
      templateFileName: "forgot-password",
      context: {
        description: `Pour réinitialiser votre mot de passe, allez sur le site: ${configs.forgotPasswordURLfr}.\nVotre jeton est: ${token}\n.Ce jeton est valide pour une durée de 15 minutes.\n\nTo reset your password, go to: ${configs.forgotPasswordURLen}.  Your token is ${token}.\nThis token will be valid for the next 15 minutes.`,
      },
    });

    return forgotPasswordCreateApi;
  }

  public async userPatch(user: User): Promise<User> {
    const { id: userId, refreshTokens } = user;
    const patchedUser = await this.userService.patch(userId, {
      refreshTokens,
    });

    return patchedUser;
  }

  public async getUser(userId: string): Promise<User> {
    const userGetById = await this.userService.getById(userId);
    return userGetById;
  }

  public signJwtToken(payload: JwtPayload): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  public signRefreshToken(userId: string, rememberMe: boolean): string {
    const payload = { userId };
    const refreshToken = rememberMe
      ? this.refreshLongService.sign(payload)
      : this.refreshShortService.sign(payload);
    return refreshToken;
  }

  public decodeJwtToken(jwtToken: string): JwtTokenPayload {
    const decodedJwtToken = this.jwtService.decode(jwtToken) as JwtTokenPayload;
    return decodedJwtToken;
  }

  public decodeRefreshToken(refreshToken: string): DecodedRefreshToken {
    const decodedRefreshToken = this.refreshLongService.decode(
      refreshToken,
    ) as DecodedRefreshToken;
    return decodedRefreshToken;
  }

  public async verifyRefreshToken(
    refreshToken: string,
  ): Promise<BaseAuthPayload> {
    try {
      const verifyRefresh = await this.refreshLongService.verifyAsync(
        refreshToken,
      );
      return verifyRefresh;
    } catch (err) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }
  }

  public async login(email: string, passwordHash: string): Promise<User> {
    const userSearch: UserSearch = {
      pagination: {
        limit: -1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          email: [{ operator: BasicOperator.Equal, values: [email] }],
        },
      ],
    };
    const userSearchApi = await this.userService.search(userSearch);
    const users = userSearchApi.value!;
    if (users.length !== 1) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }
    const user = users[0];
    const { password } = user;
    if (!password) {
      throw new InternalServerException("No password in User");
    }

    const isPasswordMatch = await bcrypt.compare(passwordHash, password);
    if (!isPasswordMatch) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }

    unset(user, "password");
    return user;
  }

  public async addRefreshTokenToUser(
    userId: string,
    refreshToken: RefreshToken,
  ): Promise<User> {
    const user = await this.userService.getById(userId);
    const { userAgent } = refreshToken;

    const refreshTokens = user.refreshTokens || [];
    remove(refreshTokens, { userAgent });
    refreshTokens.push(refreshToken);
    const res = await this.userService.patch(userId, { refreshTokens });
    return res;
  }

  public async validateUserByRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const userSearch: UserSearch = {
      and: [
        { id: [{ operator: BasicOperator.Equal, values: [userId] }] },
        {
          refreshTokens_token: [
            { operator: BasicOperator.Equal, values: [refreshToken] },
          ],
        },
      ],
    };

    const userApi = await this.userService.search(userSearch);

    const [user] = userApi.value;
    return user;
  }

  public async generateJwtPayload(user: User): Promise<string> {
    const jwt = this.signJwtToken({
      userId: user.id,
      roles: user.roles,
    });

    return jwt;
  }

  private generateToken(): string {
    const password = generator.generate({
      length: 6,
      numbers: true,
      lowercase: false,
      uppercase: false,
      symbols: false,
      strict: true,
    });

    return password;
  }
}
