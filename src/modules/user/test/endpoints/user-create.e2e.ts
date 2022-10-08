import { UserCreate } from "@evoluday/evoluday-api-typescript-fetch";

import { UserContext } from "../user.e2e-spec";

export function userCreateTest(): void {
  let ctx: UserContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new User", async () => {
    const result = await ctx.userConnector.userCreate({
      userCreate: ctx.userCreate,
    });

    expect(result.isSuccess).toEqual(true);
    Object.keys(ctx.userCreate).forEach((k) => {
      const key = k as keyof UserCreate;
      const { one, two } = ctx.testHandler.parseCompare(
        ctx.userCreate[key],
        result.value![key],
      );
      typeof one === "object"
        ? expect(one).toMatchObject(two)
        : expect(one).toEqual(two);
    });
  });

  it("should create a new User as dry-run (not saving)", async () => {
    const result = await ctx.userConnector.userCreate({
      userCreate: ctx.userCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.userConnector.userGetById({
      id: result.value!.id,
    });
    expect(checkFindResult.isSuccess).toEqual(false);

    expect(result.isSuccess).toEqual(true);
    Object.keys(ctx.userCreate).forEach((k) => {
      const key = k as keyof UserCreate;
      const { one, two } = ctx.testHandler.parseCompare(
        ctx.userCreate[key],
        result.value![key],
      );
      typeof one === "object"
        ? expect(one).toMatchObject(two)
        : expect(one).toEqual(two);
    });
  });
}
