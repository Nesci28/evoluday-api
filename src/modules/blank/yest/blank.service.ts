import { Injectable } from "@nestjs/common";
import {
  Blank,
  BlankCreate,
  BlankPatch,
  BlankSearch,
  BlankUpdate,
} from "@evoluday/evoluday-api-typescript-fetch";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { BlankErrors } from "./blank.errors";
import { BlankRepository } from "./blank.repository";

@Injectable()
export class BlankService {
  constructor(
    private readonly blankRepository: BlankRepository,
  ) {}

  public async create(
    blank: BlankCreate,
    isDryRun?: boolean,
  ): Promise<Blank> {
    const res = await this.blankRepository.create(blank, isDryRun);
    return res;
  }

  public async createMany(
    blankBulk: BlankCreate[],
  ): Promise<Blank[]> {
    const res = await this.blankRepository.createMany(blankBulk);
    return res;
  }

  public async search(
    searchParams: BlankSearch,
  ): Promise<YestPaginateResult<Blank>> {
    const res = await this.blankRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: never,
  ): Promise<Blank[]> {
    const res = await this.blankRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    blankId: string,
    populate?: never,
  ): Promise<Blank> {
    const res = await this.blankRepository.getById(blankId, populate);
    return res;
  }

  public async patch(
    blankId: string,
    blank: BlankPatch,
  ): Promise<Blank> {
    await this.checkIfAlreadyArchived(blankId);
    const res = await this.blankRepository.patch(blankId, blank);
    return res;
  }

  public async update(
    blankId: string,
    blank: BlankUpdate,
    isDryRun?: boolean,
  ): Promise<Blank> {
    await this.checkIfAlreadyArchived(blankId);
    const res = await this.blankRepository.update(blankId, blank, isDryRun);
    return res;
  }

  public async archive(blankId: string): Promise<Blank> {
    await this.checkIfAlreadyArchived(blankId);
    const res = await this.blankRepository.archive(blankId);
    return res;
  }

  private async checkIfAlreadyArchived(blankId: string): Promise<Blank> {
    const blank = await this.getById(blankId);
    if (blank.archived) {
      throw new ResultHandlerException(BlankErrors.alreadyArchived);
    }

    return blank;
  }
}
