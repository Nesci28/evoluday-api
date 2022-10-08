import mongoose from "mongoose";

export function Transactionnal(): MethodDecorator {
  return (
    _: unknown,
    __: unknown,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign, func-names
    descriptor.value = async function (...args: []): Promise<any> {
      const connection = mongoose.connections.find((x) => {
        return x.readyState === 1;
      });
      if (!connection) {
        throw new Error("Missing mongo connection");
      }

      const session = await connection.startSession();
      session.startTransaction();

      try {
        const result = await originalMethod.apply(this, args);
        await session.commitTransaction();
        session.endSession();
        return result;
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err?.name === "ResultHandlerException") {
          throw err;
        }
        throw new Error(err.essage);
      }
    };
  };
}
