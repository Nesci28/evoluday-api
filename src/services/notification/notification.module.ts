import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { TwilioModule } from "nestjs-twilio";

import { configs } from "../../constants/configs.constant";
import { NotificationService } from "./notification.service";

const mailerModule = MailerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    const host = config.get("EMAIL_HOST");
    const user = config.get("EMAIL_USER");
    const pass = config.get("EMAIL_PASSWORD");
    const from = config.get("EMAIL_FROM");

    const transport = {
      host,
      secure: false,
      auth: {
        user,
        pass,
      },
    };

    return {
      transport,
      defaults: {
        from,
      },
      template: {
        dir: configs.emailTemplatesPath,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
  inject: [ConfigService],
});

const twilioModule = TwilioModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    const accountSid = config.get("TWILIO_ACCOUNT_SID");
    const authToken = config.get("TWILIO_AUTH_TOKEN");

    const obj = {
      accountSid,
      authToken,
    };
    return obj;
  },
  inject: [ConfigService],
});

@Module({
  imports: [mailerModule, twilioModule, ConfigModule],
  providers: [
    NotificationService,
    { provide: "NotificationService", useExisting: NotificationService },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
