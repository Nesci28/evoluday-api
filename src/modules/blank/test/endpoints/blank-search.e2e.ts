import { BasicOperator } from "@evoluday/evoluday-api-typescript-fetch";

import { BlankContext } from "../blank.e2e-spec";

export function blankSearchTest(): void {
  let ctx: BlankContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.blankRepository.createMany(ctx.blankCreates);
  });

  it("should return a paginated array of all Blanks", async () => {
    const res = await ctx.blankConnector.blankSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
