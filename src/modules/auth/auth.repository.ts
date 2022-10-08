/* eslint-disable new-cap */
import {
  ForgotPassword,
  ForgotPasswordCreate,
  ForgotPasswordSearch,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  MongoSearch,
  Projection,
  ToCleanedObjectFromDocument,
  ToCleanedObjectFromYestPaginateResult,
  YestMongoosePaginate,
} from "@yest/mongoose";
import { YestPaginateResult } from "@yest/mongoose/dist/src/mongo-paginate";
import { ResultHandlerException, ToResultHandlerException } from "@yest/router";
import { cloneDeep } from "lodash";
import { PaginateModel, Types } from "mongoose";

import { DateUtil } from "../../utils/date.util";
import { AuthErrors } from "./auth.errors";
import { ForgotPasswordDocument } from "./models/forgot-password.model";

@Injectable()
export class AuthRepository {
  private forgotPasswordModelPaginated: YestMongoosePaginate<ForgotPassword>;

  constructor(
    @InjectModel("MongoForgotPassword")
    private readonly forgotPasswordModel: PaginateModel<ForgotPasswordDocument>,
  ) {
    this.forgotPasswordModelPaginated =
      new YestMongoosePaginate<ForgotPassword>(forgotPasswordModel);
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("AuthRepository", AuthErrors.repoCreate)
  public async create(
    forgotPasswordCreate: ForgotPasswordCreate,
    isDryRun?: boolean,
  ): Promise<ForgotPassword> {
    const forgotPasswordCloned = cloneDeep(forgotPasswordCreate);
    const forgotPasswordDocument = isDryRun
      ? new this.forgotPasswordModel(forgotPasswordCloned)
      : await this.forgotPasswordModel.create(forgotPasswordCloned);

    return forgotPasswordDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromYestPaginateResult(
    "AuthRepository",
    AuthErrors.repoSearch,
  )
  public async search(
    forgotPasswordSearch: ForgotPasswordSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<ForgotPassword>> {
    const forgotPasswordSearchCloned = cloneDeep(forgotPasswordSearch);
    const query = MongoSearch.buildQuery<ForgotPassword>(
      forgotPasswordSearchCloned,
    );
    if (projection) {
      query.projection = projection;
    }
    const forgotPasswordPaginateResult =
      await this.forgotPasswordModelPaginated.paginateSort(query);

    return forgotPasswordPaginateResult;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("AuthRepository", AuthErrors.repoArchive)
  public async archive(forgotPasswordId: string): Promise<ForgotPassword> {
    const forgotPasswordDocument =
      await this.forgotPasswordModel.findOneAndUpdate(
        { id: new Types.ObjectId(forgotPasswordId) },
        { $set: { archived: true } },
        { new: true },
      );
    if (forgotPasswordDocument?.archived !== true) {
      throw new ResultHandlerException(AuthErrors.repoArchive);
    }

    return forgotPasswordDocument;
  }

  // TEST ONLY
  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("AuthRepository", AuthErrors.repoPatch)
  public async overrideCreatedAt(
    forgotPasswordId: string,
  ): Promise<ForgotPassword> {
    const createdAt = DateUtil.addToDate(new Date(), 10, "hour");

    const forgotPasswordDocument =
      await this.forgotPasswordModel.findOneAndUpdate(
        { id: new Types.ObjectId(forgotPasswordId) },
        { $set: { date: createdAt.toISOString() } },
        { new: true },
      );
    if (!forgotPasswordDocument) {
      throw new ResultHandlerException(AuthErrors.notFound);
    }

    return forgotPasswordDocument;
  }
}
