import {
  Configuration,
  UserRole,
} from "@evoluday/evoluday-api-typescript-fetch";
import { MongoMemoryHandler } from "@yest/mongoose-test";
import { YestRouterModule } from "@yest/router";
import { SecurityService } from "@yest/security";
import { TestHandler } from "@yest/test";
import { cloneDeep, unset } from "lodash";
import mongoose from "mongoose";

import { AppModule, meta } from "../src/app.module";
import { configs } from "../src/constants/configs.constant";
import { Context, createMany, createOne, updateField } from "./global";

export default async (): Promise<void> => {
  const startSetupDate = new Date().getTime();
  console.log("Setuping tests");
  unset(globalThis, "context");
  globalThis.context = {} as Context<any, any>;
  globalThis.context.testHandler = new TestHandler();
  globalThis.context.mongoMemory = new MongoMemoryHandler();

  const clonedMeta = cloneDeep(meta);

  // Create the App
  const yestModuleRouter = YestRouterModule.forRoot({
    apiDoc: configs.resolvedPath,
    testMode: true,
    destroy$: globalThis.context.testHandler.destroy$,
  });
  clonedMeta.imports.push(
    globalThis.context.mongoMemory.setup(27018),
    yestModuleRouter,
  );
  Reflect.defineMetadata("testMode", true, AppModule);
  const startBuildDate = new Date().getTime();
  await globalThis.context.testHandler.createApp(clonedMeta, {
    resolvedPath: configs.resolvedPath,
  });
  const endBuildDate = new Date().getTime();
  console.log(`App built in: ${endBuildDate - startBuildDate}ms`);

  // Fill CTX
  globalThis.context.securityService = (
    globalThis.context.testHandler as TestHandler
  ).get<SecurityService>(SecurityService);
  const jwtToken = globalThis.context.securityService.signJwtToken({
    id: new mongoose.Types.ObjectId().toHexString(),
    roles: [UserRole.E2E],
  });
  const config = new Configuration({
    headers: { authorization: `bearer ${jwtToken}` },
  });
  globalThis.context.memberUserId = new mongoose.Types.ObjectId().toHexString();
  const jwtTokenMember = (globalThis.context.testHandler as TestHandler)
    .get<SecurityService>(SecurityService)
    .signJwtToken({
      id: globalThis.context.memberUserId,
    });
  const configMember = new Configuration({
    headers: { authorization: `bearer ${jwtTokenMember}` },
  });
  globalThis.context.jwtToken = jwtToken;
  globalThis.context.config = config;
  globalThis.context.jwtTokenMember = jwtTokenMember;
  globalThis.context.configMember = configMember;
  globalThis.context.createOne = createOne;
  globalThis.context.createMany = createMany;
  globalThis.context.updateField = updateField;
  const endSetupDate = new Date().getTime();
  console.log(`Setup done in: ${endSetupDate - startSetupDate}ms`);
};
