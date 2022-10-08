import {
  User,
  UserCreate,
  UserPatch,
  UserSearch,
  UserUpdate,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { UserErrors } from "./user.errors";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(user: UserCreate, isDryRun?: boolean): Promise<User> {
    const res = await this.userRepository.create(user, isDryRun);
    return res;
  }

  public async createMany(userBulk: UserCreate[]): Promise<User[]> {
    const res = await this.userRepository.createMany(userBulk);
    return res;
  }

  public async search(
    searchParams: UserSearch,
  ): Promise<YestPaginateResult<User>> {
    const res = await this.userRepository.search(searchParams);
    return res;
  }

  public async getAll(isArchived?: boolean, populate?: never): Promise<User[]> {
    const res = await this.userRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(userId: string, populate?: never): Promise<User> {
    const res = await this.userRepository.getById(userId, populate);
    return res;
  }

  public async patch(userId: string, user: UserPatch): Promise<User> {
    await this.checkIfAlreadyArchived(userId);
    const res = await this.userRepository.patch(userId, user);
    return res;
  }

  public async update(
    userId: string,
    user: UserUpdate,
    isDryRun?: boolean,
  ): Promise<User> {
    await this.checkIfAlreadyArchived(userId);
    const res = await this.userRepository.update(userId, user, isDryRun);
    return res;
  }

  public async archive(userId: string): Promise<User> {
    await this.checkIfAlreadyArchived(userId);
    const res = await this.userRepository.archive(userId);
    return res;
  }

  private async checkIfAlreadyArchived(userId: string): Promise<User> {
    const user = await this.getById(userId);
    if (user.archived) {
      throw new ResultHandlerException(UserErrors.alreadyArchived);
    }

    return user;
  }
}
