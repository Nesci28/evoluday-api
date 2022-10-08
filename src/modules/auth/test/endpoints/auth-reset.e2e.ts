import { AuthErrors } from "../../auth.errors";
import { AuthContext } from "../auth.e2e-spec";

export function authResetPasswordTest(): void {
  let ctx: AuthContext;
  let userId: string;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    userId = (await ctx.userRepository.create(ctx.userCreate)).id;
  });

  it("should reset the password if the token is valid", async () => {
    jest
      .spyOn<any, any>(ctx.notificationService, "twilioSendEmail")
      .mockImplementation(async () => {
        return { accepted: ["test"] };
      });
    const forgotPassword = await ctx.authService.forgotPassword(
      "test@test.com",
    );
    const { token } = forgotPassword;

    const beforeUser = await ctx.authService.getUser(userId);
    const res = await ctx.authConnector.resetPassword({
      resetPasswordRequestBody: {
        email: "test@test.com",
        token,
        password: "confirmedPassword",
        confirmedPassword: "confirmedPassword",
      },
    });
    const afterUser = await ctx.authService.getUser(userId);

    expect(res.isSuccess).toEqual(true);
    expect(beforeUser.password).not.toEqual(afterUser.password);
  });

  it("should return a bad request if the token is invalid", async () => {
    const res = await ctx.authConnector.resetPassword({
      resetPasswordRequestBody: {
        email: "test@test.com",
        token: "fakeToken",
        password: "confirmedPassword",
        confirmedPassword: "confirmedPassword",
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error?.httpCode).toEqual(AuthErrors.tokenInvalid.httpCode);
    expect(res.error?.uuid).toEqual(AuthErrors.tokenInvalid.uuid);
  });

  it("should return a bad request if the token is expired", async () => {
    jest
      .spyOn<any, any>(ctx.notificationService, "twilioSendEmail")
      .mockImplementation(async () => {
        return { accepted: ["test"] };
      });
    const forgotPassword = await ctx.authService.forgotPassword(
      "test@test.com",
    );
    const { token } = forgotPassword;
    await ctx.authRepository.overrideCreatedAt(forgotPassword.id);

    const res = await ctx.authConnector.resetPassword({
      resetPasswordRequestBody: {
        email: "test@test.com",
        token,
        password: "confirmedPassword",
        confirmedPassword: "confirmedPassword",
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error?.httpCode).toEqual(AuthErrors.tokenInvalid.httpCode);
    expect(res.error?.uuid).toEqual(AuthErrors.tokenInvalid.uuid);
  });
}
