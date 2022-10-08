import { unset } from "lodash";

export default async (): Promise<void> => {
  await globalThis.context.testHandler.close();
  await globalThis.context.mongoMemory.stop();
  unset(globalThis, "context");
};
