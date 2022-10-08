import { AuthErrors } from "../../auth.errors";
import { AuthContext } from "../auth.e2e-spec";

export function authForgotPasswordTest(): void {
  let ctx: AuthContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.userRepository.create(ctx.userCreate);
  });

  it("should send a forgot password token by Email", async () => {
    const twilioSendSMSSpy = jest
      .spyOn<any, any>(ctx.notificationService, "twilioSendEmail")
      .mockImplementation(async () => {
        return { accepted: ["test"] };
      });

    const res = await ctx.authConnector.forgotPassword({
      forgotPasswordRequestBody: {
        email: "test@test.com",
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(twilioSendSMSSpy).toHaveBeenCalled();
  });

  it("should not send a forgot password token by Email", async () => {
    const twilioSendSMSSpy = jest
      .spyOn<any, any>(ctx.notificationService, "twilioSendEmail")
      .mockImplementation(async () => {
        return { accepted: ["test"] };
      });

    const res = await ctx.authConnector.forgotPassword({
      forgotPasswordRequestBody: {
        email: "test1@test.com",
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error!.httpCode).toEqual(AuthErrors.wrongCredentials.httpCode);
    expect(res.error!.uuid).toEqual(AuthErrors.wrongCredentials.uuid);
    expect(twilioSendSMSSpy).not.toHaveBeenCalled();
  });
}
