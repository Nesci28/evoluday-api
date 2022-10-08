import { StatusCodes } from "http-status-codes";

import { UserErrors } from "../../../../../src/modules/user/user.errors";
import { UserContext } from "../user.e2e-spec";

export function userArchiveTest(): void {
  let ctx: UserContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified User", async () => {
    const user = await ctx.userRepository.create(ctx.userCreate);

    const result = await ctx.userConnector.userArchive({ id: user.id });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid User id", async () => {
    const fakeUserId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.userConnector.userArchive({ id: fakeUserId });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(UserErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived User", async () => {
    const user = await ctx.userRepository.create(ctx.userCreate);
    await ctx.userRepository.archive(user.id);

    const result = await ctx.userConnector.userArchive({ id: user.id });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(UserErrors.alreadyArchived.uuid);
  });
}
