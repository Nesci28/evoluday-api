import { Blank } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { BlankContext } from "../blank.e2e-spec";
import { BlankErrors } from "../../../../../src/modules/blank/blank.errors";

export function blankGetByIdTest(): void {
  let ctx: BlankContext;
  let blanks: Blank[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    blanks = await ctx.blankRepository.createMany(ctx.blankCreates);
  });

  it("should return a specific Blank", async () => {
    const results = await ctx.blankConnector.blankGetById({ id: blanks[0].id });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(blanks[0].id);
  });

  it("should return not found when using an invalid Blank id", async () => {
    const fakeBlankId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.blankConnector.blankGetById({ id: fakeBlankId });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(BlankErrors.notFound.uuid);
  });
}
