import { StatusCodes } from "http-status-codes";

import { BlankErrors } from "../../../../../src/modules/blank/blank.errors";
import { BlankContext } from "../blank.e2e-spec";

export function blankArchiveTest(): void {
  let ctx: BlankContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Blank", async () => {
    const blank = await ctx.blankRepository.create(ctx.blankCreate);

    const result = await ctx.blankConnector.blankArchive({ id: blank.id });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Blank id", async () => {
    const fakeBlankId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.blankConnector.blankArchive({ id: fakeBlankId });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(BlankErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Blank", async () => {
    const blank = await ctx.blankRepository.create(ctx.blankCreate);
    await ctx.blankRepository.archive(blank.id);

    const result = await ctx.blankConnector.blankArchive({ id: blank.id });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(BlankErrors.alreadyArchived.uuid);
  });
}
