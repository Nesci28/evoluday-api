/* eslint-disable new-cap */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Blank,
  BlankCreate,
  BlankPatch,
  BlankSearch,
  BlankUpdate,
} from "@evoluday/evoluday-api-typescript-fetch";
import {
  MongoSearch,
  MongoUtil,
  Projection,
  ToCleanedObjectFromDocument,
  ToCleanedObjectFromYestPaginateResult,
  YestMongoosePaginate,
  YestPaginateResult,
} from "@yest/mongoose";
import { ResultHandlerException, ToResultHandlerException } from "@yest/router";
import { cloneDeep } from "lodash";
import { PaginateModel, Types } from "mongoose";

import { BlankErrors } from "./blank.errors";
import { BlankDocument } from "./models/blank.model";

@Injectable()
export class BlankRepository {
  private blankModelPaginated: YestMongoosePaginate<Blank>;

  constructor(
    @InjectModel("MongoBlank")
    private readonly blankModel: PaginateModel<BlankDocument>,
  ) {
    this.blankModelPaginated = new YestMongoosePaginate<Blank>(blankModel);
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoCreate)
  public async create(
    blank: BlankCreate,
    isDryRun?: boolean,
  ): Promise<Blank> {
    const blankCloned = cloneDeep(blank);
    const blankDocument = isDryRun
      ? new this.blankModel(blankCloned)
      : await this.blankModel.create(blankCloned);

    return blankDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoCreateMany)
  public async createMany(
    blankBulk: BlankCreate[],
    isDryRun?: boolean,
  ): Promise<Blank[]> {
    const blankBulkCloned = cloneDeep(blankBulk);
    const blankDocuments = isDryRun
      ? blankBulkCloned.map((x) => {
          return new this.blankModel(x);
        })
      : await this.blankModel.insertMany(blankBulkCloned);

    return blankDocuments;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromYestPaginateResult("BlankRepository", BlankErrors.repoSearch)
  public async search(searchParams: BlankSearch, projection?: Projection): Promise<YestPaginateResult<Blank>> {
    const searchParamsCloned = cloneDeep(searchParams);
    const query = MongoSearch.buildQuery<Blank>(searchParamsCloned);
    if (projection) {
      query.projection = projection;
    }
    const blankYestPaginateResult = await this.blankModelPaginated.paginateSort(
      query,
    );

    return blankYestPaginateResult;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoGetAll)
  public async getAll(
    isArchived?: boolean,
    populate?: never,
  ): Promise<Blank[]> {
    const query = isArchived || isArchived === false ? { archived: isArchived } : {};
    const blankQuery = this.blankModel.find(query).limit(1000);
    if (populate) {
        blankQuery.populate(MongoUtil.generatePopulate(populate));
      }
    const blankDocuments = await blankQuery.exec();

    return blankDocuments;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoGetById)
  public async getById(
    blankId: string,
    populate?: never,
  ): Promise<Blank> {
    const blankQuery = this.blankModel.findOne({ id: new Types.ObjectId(blankId) });
    if (populate) {
        blankQuery.populate(MongoUtil.generatePopulate(populate));
      }
    const blankDocument = await blankQuery.exec();
    if (!blankDocument) {
      throw new ResultHandlerException(BlankErrors.notFound);
    }

    return blankDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoPatch)
  public async patch(
    blankId: string,
    blank: BlankPatch,
  ): Promise<Blank> {
    const blankCloned = cloneDeep(blank);
    const blankDocument = await this.blankModel.findOneAndUpdate(
      { id: new Types.ObjectId(blankId) },
      { $set: blankCloned },
      { new: true },
    );
    if (!blankDocument) {
      throw new ResultHandlerException(BlankErrors.notFound);
    }

    return blankDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoUpdate)
  public async update(
    blankId: string,
    blank: BlankUpdate,
    isDryRun?: boolean,
  ): Promise<Blank> {
    const blankCloned = cloneDeep(blank);
    if (isDryRun) {
      const blankDocument = new this.blankModel(blankCloned);
      return blankDocument;
    }
    const blankDocument = await this.blankModel.findOneAndUpdate(
      { id: new Types.ObjectId(blankId) },
      blankCloned,
      { unset: true, new: true },
    );
    if (!blankDocument) {
      throw new ResultHandlerException(BlankErrors.notFound);
    }

    return blankDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("BlankRepository", BlankErrors.repoArchive)
  public async archive(blankId: string): Promise<Blank> {
    const blankDocument = await this.blankModel.findOneAndUpdate(
      { id: new Types.ObjectId(blankId) },
      { $set: { archived: true } },
      { new: true },
    );
    if (blankDocument?.archived !== true) {
      throw new ResultHandlerException(BlankErrors.repoArchive);
    }

    return blankDocument;
  }
}
