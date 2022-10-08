import {
  UserArchiveResponse,
  UserCreate,
  UserCreateResponse,
  UserFindByIdResponse,
  UserGetAllResponse,
  UserPatch,
  UserPatchResponse,
  UserSearch,
  UserSearchResponse,
  UserUpdate,
  UserUpdateResponse,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, RolesGuard } from "@yest/security";

import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userCreate(
    @Body() user: UserCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<UserCreateResponse> {
    const { isDryRun } = query;
    const res = await this.userService.create(user, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userSearch(
    @Body() body: UserSearch,
  ): Promise<UserSearchResponse> {
    const res = await this.userService.search(body);
    const { value, pagination } = res;
    return ResultHandler.ok(value, pagination);
  }

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userGetById(
    @Param() params: { id: string },
  ): Promise<UserFindByIdResponse> {
    const { id: userId } = params;
    const res = await this.userService.getById(userId);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userGetAll(
    @Query() query: { isArchived?: boolean },
  ): Promise<UserGetAllResponse> {
    const { isArchived } = query;
    const res = await this.userService.getAll(isArchived);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userPatch(
    @Param() params: { id: string },
    @Body() user: UserPatch,
  ): Promise<UserPatchResponse> {
    const { id: userId } = params;
    const res = await this.userService.patch(userId, user);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userUpdate(
    @Param() params: { id: string },
    @Body() user: UserUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<UserUpdateResponse> {
    const { id: userId } = params;
    const { isDryRun } = query;
    const res = await this.userService.update(userId, user, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, RolesGuard)
  public async userArchive(
    @Param() params: { id: string },
  ): Promise<UserArchiveResponse> {
    const { id: userId } = params;
    const res = await this.userService.archive(userId);
    return ResultHandler.ok(res);
  }
}
