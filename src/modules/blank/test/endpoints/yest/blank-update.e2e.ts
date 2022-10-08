import { Blank } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { BlankErrors } from "../../../../../src/modules/blank/blank.errors";
import { BlankContext } from "../blank.e2e-spec";

export function blankUpdateTest(): void {
  let ctx: BlankContext;
  let blank: Blank;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    blank = await ctx.blankRepository.create(ctx.blankCreate);
  });

  it("should update the specified Blank", async () => {
    const result = await ctx.blankConnector.blankUpdate({
      id: blank.id,
      blankUpdate: ctx.blankUpdate,
    });

    const { one, two } = ctx.testHandler.parseCompare(ctx.blankUpdate[ctx.blankKey], result.value![ctx.blankKey]);
    typeof one === "object" ? expect(one).toMatchObject(two) : expect(one).toEqual(two);
    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(blank.id);
  });

  it("should update the specified Blank as dry-run (not saving)", async () => {
    const updatedValue = ctx.blankUpdate[ctx.blankKey];

    const result = await ctx.blankConnector.blankUpdate({
      id: blank.id,
      blankUpdate: ctx.blankUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.blankRepository.getById(result.value!.id);
    const checkValue = checkFindResult[ctx.blankKey];
    const checkParsed = ctx.testHandler.parseCompare(updatedValue, checkValue);
    expect(checkParsed.one).not.toEqual(checkParsed.two);

    const { one, two } = ctx.testHandler.parseCompare(updatedValue, result.value![ctx.blankKey]);
    typeof one === "object" ? expect(one).toMatchObject(two) : expect(one).toEqual(two);
    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(blank.id);
  });

  it("should throw a bad request when trying to update an archived Blank", async () => {
    await ctx.blankRepository.archive(blank.id);

    const result = await ctx.blankConnector.blankUpdate({
      id: blank.id,
      blankUpdate: ctx.blankUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(BlankErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Blank id", async () => {
    const fakeBlankId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.blankConnector.blankUpdate({
      id: fakeBlankId,
      blankUpdate: ctx.blankUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(BlankErrors.notFound.uuid);
  });
}
