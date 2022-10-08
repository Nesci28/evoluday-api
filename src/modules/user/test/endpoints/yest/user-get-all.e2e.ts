import { UserContext } from "../user.e2e-spec";

export function userGetAllTest(): void {
  let ctx: UserContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.userRepository.createMany(ctx.userCreates);
  });

  it("should return an array of Users", async () => {
    const results = await ctx.userConnector.userGetAll({});

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
