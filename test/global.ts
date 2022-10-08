import {
  BaseModel,
  Configuration,
} from "@evoluday/evoluday-api-typescript-fetch";
import { MongoMemoryHandler } from "@yest/mongoose-test";
import { SecurityService } from "@yest/security";
import { TestHandler } from "@yest/test";
import mongoose from "mongoose";

import { configs } from "../src/constants/configs.constant";

export interface Context<T, U> {
  testHandler: TestHandler;
  mongoMemory: MongoMemoryHandler;
  jwtToken: string;
  config: Configuration;
  jwtTokenMember: string;
  configMember: Configuration;
  securityService: SecurityService;
  createOne: (
    modelName: string,
    testHandler: TestHandler,
    createMongoFields?: boolean,
    isArchived?: boolean,
  ) => T;
  createMany: (
    modelName: string,
    testHandler: TestHandler,
    createMongoFields?: boolean,
    amountToCreate?: number,
  ) => T[];
  updateField: (
    modelName: string,
    modelCreate: T,
    forbiddenFields: string[],
    testHandler: TestHandler,
  ) => { key: string; update: U };
}

export function updateField<T extends Record<any, any>, U>(
  modelName: string,
  modelCreate: U,
  forbiddenFields: string[],
  testHandler: TestHandler,
): { key: string; update: U } {
  let field;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    field = testHandler.fakeField<T>(
      modelName,
      configs.resolvedPath,
      modelCreate,
    );
    const isForbidden = forbiddenFields.includes(Object.keys(field)[0]);
    if (!isForbidden) {
      break;
    }
  }
  const key = Object.keys(field)[0] as string;
  const update = { ...modelCreate, ...field };
  return { key, update };
}

export function createMany<T extends BaseModel>(
  modelName: string,
  testHandler: TestHandler,
  createMongoFields = true,
  amountToCreate = 100,
): T[] {
  const bulk = [...Array(amountToCreate).keys()].map(() => {
    const fakeObject = testHandler.fakeObject<T>(
      modelName,
      configs.resolvedPath,
    );
    if (createMongoFields) {
      fakeObject.id = new mongoose.Types.ObjectId().toHexString();
      fakeObject.archived = false;
    }
    return fakeObject;
  });

  return bulk;
}

export function createOne<T extends BaseModel>(
  modelName: string,
  testHandler: TestHandler,
  createMongoFields = true,
  isArchived = false,
): T {
  const model = testHandler.fakeObject<T>(modelName, configs.resolvedPath);
  if (createMongoFields) {
    model.id = new mongoose.Types.ObjectId().toHexString();
    model.archived = isArchived;
  }
  return model;
}
