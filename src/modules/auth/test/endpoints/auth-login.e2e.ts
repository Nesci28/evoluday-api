import { DateUtil } from "../../../../utils/date.util";
import { AuthErrors } from "../../auth.errors";
import { AuthContext } from "../auth.e2e-spec";

export function authLoginTest(): void {
  let ctx: AuthContext;
  let userId: string;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    userId = (await ctx.userRepository.create(ctx.userCreate)).id;
  });

  it("should login successfully and have a long refresh token", async () => {
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        email: "test@test.com",
        password: "password",
        rememberMe: true,
      },
    });
    const decodedRefreshToken = ctx.authService.decodeRefreshToken(
      res.value!.refreshToken,
    );

    const expirationDate = new Date(decodedRefreshToken.exp * 1000);
    const oneYear = DateUtil.addToDate(DateUtil.newDate(), 1, "year");
    const inOneYearMinusOneDay = DateUtil.addToDate(oneYear, -1, "day");
    const inOneYearPlusOneDay = DateUtil.addToDate(oneYear, 1, "day");
    const IsBetween = DateUtil.isBetween(
      expirationDate,
      inOneYearMinusOneDay,
      inOneYearPlusOneDay,
    );

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
    expect(res.value?.refreshToken).toBeDefined();
    expect(IsBetween).toEqual(true);
  });

  it("should login successfully and have a short refresh token", async () => {
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        email: "test@test.com",
        password: "password",
        rememberMe: false,
      },
    });
    const decodedRefreshToken = ctx.authService.decodeRefreshToken(
      res.value!.refreshToken,
    );

    const expirationDate = new Date(decodedRefreshToken.exp * 1000);
    const newDate = DateUtil.newDate();
    const newDateMinusOneHour = DateUtil.addToDate(newDate, -1, "hour");
    const newDatePlusOneHour = DateUtil.addToDate(newDate, 1, "hour");
    const IsBetween = DateUtil.isBetween(
      expirationDate,
      newDateMinusOneHour,
      newDatePlusOneHour,
    );

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
    expect(res.value?.refreshToken).toBeDefined();
    expect(IsBetween).toEqual(true);
  });

  it("should fail to login", async () => {
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        email: "fake@test.com",
        password: "password",
        rememberMe: true,
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error?.httpCode).toEqual(AuthErrors.wrongCredentials.httpCode);
    expect(res.error?.uuid).toEqual(AuthErrors.wrongCredentials.uuid);
  });

  it("should have no AccessScopes in the Jwt Token", async () => {
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        email: "test@test.com",
        password: "password",
        rememberMe: true,
      },
    });
    const { jwt } = res.value!;

    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    expect(decodedJwt.userId).toEqual(userId);
  });

  it("should replace the RefreshToken on a second login with the same UserAgent", async () => {
    await ctx.authConnector.login({
      loginRequestBody: {
        email: "test@test.com",
        password: "password",
        rememberMe: true,
      },
    });
    await ctx.authConnector.login({
      loginRequestBody: {
        email: "test@test.com",
        password: "password",
        rememberMe: true,
      },
    });

    const user = await ctx.userRepository.getById(userId);

    expect(user.refreshTokens).toHaveLength(1);
  });
}
