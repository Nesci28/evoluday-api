import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { BlankController } from "./blank.controller";
import { BlankRepository } from "./blank.repository";
import { BlankService } from "./blank.service";
import { MongoBlankSchema } from "./models/blank.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "MongoBlank", schema: MongoBlankSchema },
    ]),
  ],
  controllers: [BlankController],
  providers: [
    BlankService,
    BlankRepository,
    { provide: "BlankService", useExisting: BlankService },
    { provide: "BlankRepository", useExisting: BlankRepository },
  ],
  exports: [BlankService],
})
export class BlankModule {}
