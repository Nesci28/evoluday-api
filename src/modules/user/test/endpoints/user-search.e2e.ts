import { BasicOperator } from "@evoluday/evoluday-api-typescript-fetch";

import { UserContext } from "../user.e2e-spec";

export function userSearchTest(): void {
  let ctx: UserContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.userRepository.createMany(ctx.userCreates);
  });

  it("should return a paginated array of all Users", async () => {
    const res = await ctx.userConnector.userSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
