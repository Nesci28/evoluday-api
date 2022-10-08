import {
  BlankArchiveResponse,
  BlankCreate,
  BlankCreateResponse,
  BlankFindByIdResponse,
  BlankGetAllResponse,
  BlankPatch,
  BlankPatchResponse,
  BlankSearch,
  BlankSearchResponse,
  BlankUpdate,
  BlankUpdateResponse,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";

import { BlankService } from "./blank.service";

@Controller()
export class BlankController {
  constructor(private readonly blankService: BlankService) {}

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankCreate(
    @Body() blank: BlankCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<BlankCreateResponse> {
    const { isDryRun } = query;
    const res = await this.blankService.create(blank, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankSearch(
    @Body() body: BlankSearch,
  ): Promise<BlankSearchResponse> {
    const res = await this.blankService.search(body);
    const { value, pagination } = res;
    return ResultHandler.ok(value, pagination);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankGetById(
    @Param() params: { id: string },
  ): Promise<BlankFindByIdResponse> {
    const { id: blankId } = params;
    const res = await this.blankService.getById(blankId);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankGetAll(
    @Query() query: { isArchived?: boolean },
  ): Promise<BlankGetAllResponse> {
    const { isArchived } = query;
    const res = await this.blankService.getAll(isArchived);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankPatch(
    @Param() params: { id: string },
    @Body() blank: BlankPatch,
  ): Promise<BlankPatchResponse> {
    const { id: blankId } = params;
    const res = await this.blankService.patch(blankId, blank);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankUpdate(
    @Param() params: { id: string },
    @Body() blank: BlankUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<BlankUpdateResponse> {
    const { id: blankId } = params;
    const { isDryRun } = query;
    const res = await this.blankService.update(blankId, blank, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async blankArchive(
    @Param() params: { id: string },
  ): Promise<BlankArchiveResponse> {
    const { id: blankId } = params;
    const res = await this.blankService.archive(blankId);
    return ResultHandler.ok(res);
  }
}
