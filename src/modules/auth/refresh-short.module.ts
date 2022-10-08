import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule as NestJwtModule, JwtService } from "@nestjs/jwt";
import { decode } from "js-base64";

const refreshModule = NestJwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const publicKeyConfig = configService.get<string>("REFRESH_PUBLIC_KEY");
    const privateKeyConfig = configService.get<string>("REFRESH_PRIVATE_KEY");
    const jwtExpiration = configService.get<string>("REFRESH_EXPIRATION_SHORT");
    if (!publicKeyConfig || !privateKeyConfig) {
      throw new Error("missing publicKey or privateKey");
    }

    const publicKey = decode(publicKeyConfig);
    const privateKey = decode(privateKeyConfig);

    return {
      publicKey,
      privateKey,
      signOptions: { expiresIn: jwtExpiration, algorithm: "RS256" },
    };
  },
});

const refreshModuleImports = [refreshModule];

const refreshModuleProviders = [
  {
    provide: "YestRefreshShortService",
    useExisting: JwtService,
  },
];

const refreshModuleExports = ["YestRefreshShortService"];

@Module({
  imports: refreshModuleImports,
  providers: refreshModuleProviders,
  exports: [...refreshModuleProviders, ...refreshModuleExports],
})
export class RefreshShortModule {}
