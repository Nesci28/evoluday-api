import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { ResultHandler } from "@yest/result-handler";
import { ToResultHandlerException } from "@yest/router";
import { InjectTwilio, TwilioClient } from "nestjs-twilio";

import { configs } from "../../constants/configs.constant";
import { NotificationErrors } from "./notification.errors";

interface TwilioSMS {
  body: string;
  from: string;
  to: string;
}

interface TwilioEmail {
  email: string;
  subject: string;
  templateFileName: string;
  context: Record<string, unknown>;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectTwilio() private readonly client: TwilioClient,
  ) {}

  @ToResultHandlerException()
  public async sendSMS(template: {
    body: string;
    phoneNumber: string;
  }): Promise<ResultHandler<boolean>> {
    try {
      const fromPhoneNumber = this.configService.get("SMS_FROM");
      const { body, phoneNumber } = template;
      const isPhoneNumberValid = /\d{10}/.test(phoneNumber);
      const isFromPhoneNumberValid = /\d{10}/.test(fromPhoneNumber);
      if (!isPhoneNumberValid || !isFromPhoneNumberValid) {
        throw new Error("Error with phone numbers");
      }

      const res = await this.twilioSendSMS({
        body,
        from: `+1${fromPhoneNumber}`,
        to: `+1${phoneNumber}`,
      });
      if (res.errorCode) {
        return ResultHandler.fail(NotificationErrors.smsFailed);
      }

      return ResultHandler.ok(true);
    } catch (err) {
      return ResultHandler.fail(NotificationErrors.smsFailed);
    }
  }

  @ToResultHandlerException()
  public async sendEmail(
    template: TwilioEmail,
  ): Promise<ResultHandler<boolean>> {
    try {
      const res = await this.twilioSendEmail(template);

      if (res.rejected?.length) {
        return ResultHandler.fail(NotificationErrors.emailFailed);
      }
      if (res.accepted?.length !== 1) {
        return ResultHandler.fail(NotificationErrors.emailFailed);
      }

      return ResultHandler.ok(true);
    } catch (err) {
      return ResultHandler.fail(NotificationErrors.emailFailed);
    }
  }

  private async twilioSendSMS(
    body: TwilioSMS,
  ): Promise<{ errorCode?: unknown }> {
    const res = await this.client.messages.create(body);
    return res;
  }

  private async twilioSendEmail(
    template: TwilioEmail,
  ): Promise<{ rejected?: unknown[]; accepted?: unknown[] }> {
    const { email, subject, templateFileName, context } = template;

    const res = await this.mailerService.sendMail({
      to: email,
      subject,
      template: `${configs.appRoot}/src/mails/${templateFileName}`,
      context,
    });
    return res;
  }
}
