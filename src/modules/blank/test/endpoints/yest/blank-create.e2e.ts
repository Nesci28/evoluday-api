import { BlankCreate } from "@evoluday/evoluday-api-typescript-fetch";

import { BlankContext } from "../blank.e2e-spec";

export function blankCreateTest(): void {
  let ctx: BlankContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Blank", async () => {
    const result = await ctx.blankConnector.blankCreate({
      blankCreate: ctx.blankCreate,
    });

    expect(result.isSuccess).toEqual(true);
    Object.keys(ctx.blankCreate).forEach((k) => {
      const key = k as keyof BlankCreate;
      const { one, two } = ctx.testHandler.parseCompare(ctx.blankCreate[key], result.value![key]);
      typeof one === "object" ? expect(one).toMatchObject(two) : expect(one).toEqual(two);
    });
  });

  it("should create a new Blank as dry-run (not saving)", async () => {
    const result = await ctx.blankConnector.blankCreate({
      blankCreate: ctx.blankCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.blankConnector.blankGetById({
      id: result.value!.id
    });
    expect(checkFindResult.isSuccess).toEqual(false);

    expect(result.isSuccess).toEqual(true);
    Object.keys(ctx.blankCreate).forEach((k) => {
      const key = k as keyof BlankCreate;
      const { one, two } = ctx.testHandler.parseCompare(ctx.blankCreate[key], result.value![key]);
      typeof one === "object" ? expect(one).toMatchObject(two) : expect(one).toEqual(two);
    });
  });
}
