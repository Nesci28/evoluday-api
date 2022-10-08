/* eslint-disable max-len */
import { SupportedLanguage } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const BlankErrors = {
  notFound: {
    uuid: "1422acad-1cb6-4516-b6f1-274c9d471e26",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        { language: SupportedLanguage.Fr, text: "L'objet Blank est introuvable." },
        { language: SupportedLanguage.En, text: "Blank object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "f6a6e849-8b08-4a86-8471-d1ac5bcb13e2",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Le base de donnée n'a pas été en mesure de traiter la demande.",
        },
        { language: SupportedLanguage.En, text: "Database server was unable to respond." },
      ],
    },
  },
  alreadyArchived: {
    uuid: "a18eb52b-dc94-4c3d-b7ce-ddabe1bf646e",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet Blank. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that Blank object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "bbab67af-f24e-4288-b2f7-9296e78e97c9",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Blank object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "85be3194-259c-415e-852b-321bd7164e58",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many Blank objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "53d0188a-4ec4-4099-b5a1-438c4ac885ea",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Blank objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "aa8cee18-dff2-4be1-8062-5a3579abd5e5",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all Blank objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "9ac81f79-a914-49b2-9ae4-108a19bb6b1c",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an Blank object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "c5fe00b0-6fa3-4be3-8544-dec36ffd3a5a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Blank object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "46d8a08b-acca-46e2-ad33-99aa6f9019f5",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an Blank object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "d0f5308d-2de2-48f5-80a2-1e48330899fc",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Blank.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Blank object.",
        },
      ],
    },
  },
};
