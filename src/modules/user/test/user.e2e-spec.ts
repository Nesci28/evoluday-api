import {
  UserApi,
  UserCreate,
  UserPatch,
  UserUpdate,
} from "@evoluday/evoluday-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { UserRepository } from "../user.repository";
import { UserService } from "../user.service";
import { userArchiveTest } from "./endpoints/user-archive.e2e";
import { userCreateTest } from "./endpoints/user-create.e2e";
import { userGetAllTest } from "./endpoints/user-get-all.e2e";
import { userGetByIdTest } from "./endpoints/user-get-by-id.e2e";
import { userPatchTest } from "./endpoints/user-patch.e2e";
import { userSearchTest } from "./endpoints/user-search.e2e";
import { userUpdateTest } from "./endpoints/user-update.e2e";

export interface UserContext extends Context<UserCreate, UserUpdate> {
  userConnector: UserApi;
  userService: UserService;
  userRepository: UserRepository;
  userKey: string;
  userCreate: UserCreate;
  userUpdate: UserUpdate;
  userPatch: UserPatch;
  userCreates: UserCreate[];
}

describe("UserController", () => {
  const ctx = globalThis.context as UserContext;

  beforeAll(async () => {
    ctx.userConnector = ctx.testHandler.prepareConnector(UserApi, ctx.config);
    ctx.userService = ctx.testHandler.get("UserService");
    ctx.userRepository = ctx.testHandler.get("UserRepository");

    ctx.userCreate = ctx.createOne(
      "UserCreate",
      ctx.testHandler,
      ctx.optionIdMap,
      false,
    );
    ctx.userCreates = ctx.createMany(
      "UserCreate",
      ctx.testHandler,
      ctx.optionIdMap,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "UserUpdate",
      ctx.userCreate,
      [],
      ctx.testHandler,
    );
    ctx.userKey = key;
    ctx.userUpdate = { ...ctx.userCreate, ...update };
    ctx.userPatch = {
      [ctx.userKey]: ctx.userUpdate[ctx.userKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();
  });

  describe("User create", userCreateTest.bind({ ctx }));
  describe("User search", userSearchTest.bind({ ctx }));
  describe("User getById", userGetByIdTest.bind({ ctx }));
  describe("User getAll", userGetAllTest.bind({ ctx }));
  describe("User patch", userPatchTest.bind({ ctx }));
  describe("User update", userUpdateTest.bind({ ctx }));
  describe("User archive", userArchiveTest.bind({ ctx }));
});
