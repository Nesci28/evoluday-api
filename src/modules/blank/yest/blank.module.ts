import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { BlankController } from "./blank.controller";
import { MongoBlankSchema } from "./models/blank.model";
import { BlankRepository } from "./blank.repository";
import { BlankService } from "./blank.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "MongoBlank", schema: MongoBlankSchema }]),
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
