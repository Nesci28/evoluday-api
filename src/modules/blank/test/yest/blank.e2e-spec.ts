import {
  Configuration,
  Blank,
  BlankApi,
  BlankCreate,
  BlankPatch,
  BlankUpdate,
} from "@evoluday/evoluday-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { BlankRepository } from "../blank.repository";
import { BlankService } from "../blank.service";
import { blankArchiveTest } from "./endpoints/blank-archive.e2e";
import { blankCreateTest } from "./endpoints/blank-create.e2e";
import { blankGetAllTest } from "./endpoints/blank-get-all.e2e";
import { blankGetByIdTest } from "./endpoints/blank-get-by-id.e2e";
import { blankPatchTest } from "./endpoints/blank-patch.e2e";
import { blankSearchTest } from "./endpoints/blank-search.e2e";
import { blankUpdateTest } from "./endpoints/blank-update.e2e";

export interface BlankContext extends Context<BlankCreate, BlankUpdate> {
  blankConnector: BlankApi;
  blankService: BlankService;
  blankRepository: BlankRepository;
  blankKey: string;
  blankCreate: BlankCreate;
  blankUpdate: BlankUpdate;
  blankPatch: BlankPatch;
  blankCreates: BlankCreate[];
}

describe("BlankController", () => {
  const ctx = globalThis.context as BlankContext;

  beforeAll(async () => {
    ctx.blankConnector = ctx.testHandler.prepareConnector(BlankApi, ctx.config);
    ctx.blankService = ctx.testHandler.get("BlankService");
    ctx.blankRepository = ctx.testHandler.get("BlankRepository");

    ctx.blankCreate = ctx.createOne(
      "BlankCreate",
      ctx.testHandler,
      ctx.optionIdMap,
      false,
    );
    ctx.blankCreates = ctx.createMany(
      "BlankCreate",
      ctx.testHandler,
      ctx.optionIdMap,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "BlankUpdate",
      ctx.blankCreate,
      [],
      ctx.testHandler,
    );
    ctx.blankKey = key;
    ctx.blankUpdate = { ...ctx.blankCreate, ...update };
    ctx.blankPatch = {
      [ctx.blankKey]: ctx.blankUpdate[ctx.blankKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();
  });

  describe("Blank create", blankCreateTest.bind({ ctx }));
  describe("Blank search", blankSearchTest.bind({ ctx }));
  describe("Blank getById", blankGetByIdTest.bind({ ctx }));
  describe("Blank getAll", blankGetAllTest.bind({ ctx }));
  describe("Blank patch", blankPatchTest.bind({ ctx }));
  describe("Blank update", blankUpdateTest.bind({ ctx }));
  describe("Blank archive", blankArchiveTest.bind({ ctx }));
});
