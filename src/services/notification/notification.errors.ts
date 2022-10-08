/* eslint-disable max-len */
import { SupportedLanguage } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const NotificationErrors = {
  emailFailed: {
    uuid: "51661145-31b6-44b5-b695-499403646996",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Erreur lors de l'envoi du courriel.",
        },
        {
          language: SupportedLanguage.En,
          text: "En error occured while sending an email.",
        },
      ],
    },
  },
  smsFailed: {
    uuid: "b5fb5e71-3a6d-4e93-80b1-b353d351ff07",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Erreur lors de l'envoi du SMS.",
        },
        {
          language: SupportedLanguage.En,
          text: "En error occured while sending a SMS.",
        },
      ],
    },
  },
};
