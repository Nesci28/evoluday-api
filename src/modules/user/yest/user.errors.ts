/* eslint-disable max-len */
import { SupportedLanguage } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const UserErrors = {
  notFound: {
    uuid: "f9662b6f-87b9-4404-95ea-c261b82d8e1f",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        { language: SupportedLanguage.Fr, text: "L'objet User est introuvable." },
        { language: SupportedLanguage.En, text: "User object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "46465b2c-da1b-48b6-a65a-101dc6a162e5",
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
    uuid: "298b0ce6-51e6-4e47-aee1-9e04bc5b479d",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Impossible de modifier cet objet User. Il est archivé.'",
        },
        {
          language: SupportedLanguage.En,
          text: "Impossible to edit that User object. It is archived.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "d2ba7943-5818-49cd-87bb-76ece295b323",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an User object.",
        },
      ],
    },
  },
  repoCreateMany: {
    uuid: "30a5e040-54f8-4ed6-86c2-997b170520a3",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de plusieurs objets User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create many User objects.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "7f0c7fe6-ef83-46ec-b651-9022d7037242",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search User objects.",
        },
      ],
    },
  },
  repoGetAll: {
    uuid: "5b5f37ec-6492-4a7d-9f45-edf9b7d35495",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande de tous les objets User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get all User objects.",
        },
      ],
    },
  },
  repoGetById: {
    uuid: "2a073050-6d90-4f48-86c4-489ad81e5f6a",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la demande d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to get an User object.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "2ec002fc-f1e8-4ee2-9a88-c337c9e6df7b",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an User object.",
        },
      ],
    },
  },
  repoUpdate: {
    uuid: "bc1bdf5c-3177-4f91-8871-5ea377222f83",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to update an User object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "f877adfb-8c61-4fec-9840-dd315d7813c4",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet User.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an User object.",
        },
      ],
    },
  },
};
