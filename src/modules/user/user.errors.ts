/* eslint-disable max-len */
import { SupportedLanguage } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const UserErrors = {
  notFound: {
    uuid: "e2a5dc5b-a1be-497e-8db5-a0dca1907326",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet User est introuvable.",
        },
        { language: SupportedLanguage.En, text: "User object was not found." },
      ],
    },
  },
  dbNotResponsive: {
    uuid: "a483a09e-fd10-4d37-a227-6f02602553ef",
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
    uuid: "307b2e2d-72d3-4e48-8bc0-c7475c8c868f",
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
    uuid: "a56da26d-4b2b-428d-b8b8-cb61a012de2d",
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
    uuid: "f464b50c-ace0-4529-842e-65fcda877912",
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
    uuid: "cd3bc7a8-7bd6-4563-93ab-527517d4abae",
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
    uuid: "4322c547-3c04-4b11-9abf-c516aeef15fe",
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
    uuid: "8c1a0b59-2161-4a70-84b1-085c6ff9e7bc",
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
    uuid: "7ff51f6e-e653-470a-b776-8199ea1c8d66",
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
    uuid: "1d10cbd6-a1f6-41ec-8504-d9edcb8d6b42",
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
    uuid: "00ecb122-799e-4e70-ac74-70b8bafc711b",
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
