/* eslint-disable new-cap */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  User,
  UserCreate,
  UserPatch,
  UserSearch,
  UserUpdate,
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

import { UserErrors } from "./user.errors";
import { UserDocument } from "./models/user.model";

@Injectable()
export class UserRepository {
  private userModelPaginated: YestMongoosePaginate<User>;

  constructor(
    @InjectModel("MongoUser")
    private readonly userModel: PaginateModel<UserDocument>,
  ) {
    this.userModelPaginated = new YestMongoosePaginate<User>(userModel);
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoCreate)
  public async create(
    user: UserCreate,
    isDryRun?: boolean,
  ): Promise<User> {
    const userCloned = cloneDeep(user);
    const userDocument = isDryRun
      ? new this.userModel(userCloned)
      : await this.userModel.create(userCloned);

    return userDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoCreateMany)
  public async createMany(
    userBulk: UserCreate[],
    isDryRun?: boolean,
  ): Promise<User[]> {
    const userBulkCloned = cloneDeep(userBulk);
    const userDocuments = isDryRun
      ? userBulkCloned.map((x) => {
          return new this.userModel(x);
        })
      : await this.userModel.insertMany(userBulkCloned);

    return userDocuments;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromYestPaginateResult("UserRepository", UserErrors.repoSearch)
  public async search(searchParams: UserSearch, projection?: Projection): Promise<YestPaginateResult<User>> {
    const searchParamsCloned = cloneDeep(searchParams);
    const query = MongoSearch.buildQuery<User>(searchParamsCloned);
    if (projection) {
      query.projection = projection;
    }
    const userYestPaginateResult = await this.userModelPaginated.paginateSort(
      query,
    );

    return userYestPaginateResult;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoGetAll)
  public async getAll(
    isArchived?: boolean,
    populate?: never,
  ): Promise<User[]> {
    const query = isArchived || isArchived === false ? { archived: isArchived } : {};
    const userQuery = this.userModel.find(query).limit(1000);
    if (populate) {
        userQuery.populate(MongoUtil.generatePopulate(populate));
      }
    const userDocuments = await userQuery.exec();

    return userDocuments;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoGetById)
  public async getById(
    userId: string,
    populate?: never,
  ): Promise<User> {
    const userQuery = this.userModel.findOne({ id: new Types.ObjectId(userId) });
    if (populate) {
        userQuery.populate(MongoUtil.generatePopulate(populate));
      }
    const userDocument = await userQuery.exec();
    if (!userDocument) {
      throw new ResultHandlerException(UserErrors.notFound);
    }

    return userDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoPatch)
  public async patch(
    userId: string,
    user: UserPatch,
  ): Promise<User> {
    const userCloned = cloneDeep(user);
    const userDocument = await this.userModel.findOneAndUpdate(
      { id: new Types.ObjectId(userId) },
      { $set: userCloned },
      { new: true },
    );
    if (!userDocument) {
      throw new ResultHandlerException(UserErrors.notFound);
    }

    return userDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoUpdate)
  public async update(
    userId: string,
    user: UserUpdate,
    isDryRun?: boolean,
  ): Promise<User> {
    const userCloned = cloneDeep(user);
    if (isDryRun) {
      const userDocument = new this.userModel(userCloned);
      return userDocument;
    }
    const userDocument = await this.userModel.findOneAndUpdate(
      { id: new Types.ObjectId(userId) },
      userCloned,
      { unset: true, new: true },
    );
    if (!userDocument) {
      throw new ResultHandlerException(UserErrors.notFound);
    }

    return userDocument;
  }

  @ToResultHandlerException()
  @ToCleanedObjectFromDocument("UserRepository", UserErrors.repoArchive)
  public async archive(userId: string): Promise<User> {
    const userDocument = await this.userModel.findOneAndUpdate(
      { id: new Types.ObjectId(userId) },
      { $set: { archived: true } },
      { new: true },
    );
    if (userDocument?.archived !== true) {
      throw new ResultHandlerException(UserErrors.repoArchive);
    }

    return userDocument;
  }
}
