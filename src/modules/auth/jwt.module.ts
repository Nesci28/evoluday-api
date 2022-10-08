import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule as NestJwtModule, JwtService } from "@nestjs/jwt";
import { decode } from "js-base64";

const jwtModule = NestJwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const publicKeyConfig = configService.get<string>("JWT_PUBLIC_KEY");
    const privateKeyConfig = configService.get<string>("JWT_PRIVATE_KEY");
    const jwtExpiration = configService.get<string>("JWT_EXPIRATION") || "5m";
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

const jwtModuleImports = [jwtModule];

const jwtModuleProviders = [
  {
    provide: "YestJwtService",
    useExisting: JwtService,
  },
];

const jwtModuleExports = ["YestJwtService"];

@Module({
  imports: jwtModuleImports,
  providers: jwtModuleProviders,
  exports: [...jwtModuleExports],
})
export class JwtModule {}
