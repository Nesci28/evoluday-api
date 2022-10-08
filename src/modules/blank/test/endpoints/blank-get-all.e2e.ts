import { BlankContext } from "../blank.e2e-spec";

export function blankGetAllTest(): void {
  let ctx: BlankContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.blankRepository.createMany(ctx.blankCreates);
  });

  it("should return an array of Blanks", async () => {
    const results = await ctx.blankConnector.blankGetAll({});

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
