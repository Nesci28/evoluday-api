import { Blank } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { BlankErrors } from "../../blank.errors";
import { BlankContext } from "../blank.e2e-spec";

export function blankPatchTest(): void {
  let ctx: BlankContext;
  let blank: Blank;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    blank = await ctx.blankRepository.create(ctx.blankCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.blankConnector.blankPatch({
      id: blank.id,
      blankPatch: ctx.blankPatch,
    });

    const { one, two } = ctx.testHandler.parseCompare(
      ctx.blankPatch[ctx.blankKey],
      result.value![ctx.blankKey],
    );
    typeof one === "object"
      ? expect(one).toMatchObject(two)
      : expect(one).toEqual(two);
    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(blank.id);
  });

  it("should throw a bad request when trying to patch an archived Blank", async () => {
    await ctx.blankRepository.archive(blank.id);

    const result = await ctx.blankConnector.blankPatch({
      id: blank.id,
      blankPatch: ctx.blankPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(BlankErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid blank id", async () => {
    const fakeBlankId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.blankConnector.blankPatch({
      id: fakeBlankId,
      blankPatch: ctx.blankPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(BlankErrors.notFound.uuid);
  });
}
