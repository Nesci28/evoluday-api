import { User } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { UserErrors } from "../../../../../src/modules/user/user.errors";
import { UserContext } from "../user.e2e-spec";

export function userPatchTest(): void {
  let ctx: UserContext;
  let user: User;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    user = await ctx.userRepository.create(ctx.userCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.userConnector.userPatch({
      id: user.id,
      userPatch: ctx.userPatch,
    });

    const { one, two } = ctx.testHandler.parseCompare(ctx.userPatch[ctx.userKey], result.value![ctx.userKey]);
    typeof one === "object" ? expect(one).toMatchObject(two) : expect(one).toEqual(two);
    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(user.id);
  });

  it("should throw a bad request when trying to patch an archived User", async () => {
    await ctx.userRepository.archive(user.id);

    const result = await ctx.userConnector.userPatch({
      id: user.id,
      userPatch: ctx.userPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(UserErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid user id", async () => {
    const fakeUserId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.userConnector.userPatch({
      id: fakeUserId,
      userPatch: ctx.userPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(UserErrors.notFound.uuid);
  });
}
