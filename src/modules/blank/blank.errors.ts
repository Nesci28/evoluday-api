/* eslint-disable max-len */
import { SupportedLanguage } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const BlankErrors = {
  notFound: {
    uuid: "4e9a3914-0426-4d47-a9a0-49eefc08b077",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Blank est introuvable.",
        },
        { language: SupportedLanguage.En, text: "Blank object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "2bb72cb8-0513-4d54-9898-0cbf3981a98f",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Le base de donnée n'a pas été en mesure de traiter la demande.",
        },
        {
          language: SupportedLanguage.En,
          text: "Database server was unable to respond.",
        },
      ],
    },
  },
  alreadyArchived: {
    uuid: "a0062b44-e3b3-485d-913b-9564c9c00315",
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
    uuid: "e7f437f4-ec4d-404e-b4ae-1eba10832599",
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
    uuid: "f957ee5a-9f06-4419-bd1f-b221d220fe9f",
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
    uuid: "5b4a7db5-c60c-45b0-af47-7964e8e3bb45",
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
    uuid: "3feba8eb-f395-4b96-b14b-38ddaa26a367",
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
    uuid: "d81ecc3d-cfc1-4951-82fd-520b12254131",
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
    uuid: "571673c0-5ce4-4d08-8053-c3d8194f19c7",
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
    uuid: "5c56f630-d4c1-42b4-a8ab-04908b5e831f",
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
    uuid: "f2ba902f-16a7-4480-b3f7-7adb4b00c917",
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
