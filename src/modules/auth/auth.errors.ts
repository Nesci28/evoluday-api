import { SupportedLanguage } from "@evoluday/evoluday-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

export const AuthErrors = {
  wrongCredentials: {
    uuid: "e078954b-8cb1-414b-93f0-50b2ff95ef02",
    httpCode: StatusCodes.UNAUTHORIZED,
    message: {
      translation: [{ text: "Wrong credentials." }],
    },
  },
  notFound: {
    uuid: "3d8fb870-d9f4-4e40-a4fc-2fe87640898d",
    httpCode: StatusCodes.NOT_FOUND,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'objet Auth est introuvable.",
        },
        {
          language: SupportedLanguage.En,
          text: "Auth object was not found.",
        },
      ],
    },
  },
  repoCreate: {
    uuid: "8efe0e37-5bda-405c-9efa-8c4248e9d3cd",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la création de l'objet Auth.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to create an Auth object.",
        },
      ],
    },
  },
  repoSearch: {
    uuid: "693678f3-71ca-49a8-99b6-37790c0ebf7d",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la recherche d'objets Auth.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to search Auth objects.",
        },
      ],
    },
  },
  repoPatch: {
    uuid: "3e6c8899-bfdd-48ef-ba37-053f40ce0881",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de la mise à jour partielle d'un objet Auth.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to patch an Auth object.",
        },
      ],
    },
  },
  repoArchive: {
    uuid: "8a373134-940e-4089-a264-e14c4a257d86",
    httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Une erreur est survenue lors de l'archivage d'un objet Auth.",
        },
        {
          language: SupportedLanguage.En,
          text: "An error occured while trying to archive an Auth object.",
        },
      ],
    },
  },
  passwordsDontMatch: {
    uuid: "66f65edf-0972-4cea-8f31-1921df55a950",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Les mot de passes doivent correspondent.",
        },
        {
          language: SupportedLanguage.En,
          text: "Passwords must match.",
        },
      ],
    },
  },
  tokenInvalid: {
    uuid: "9b9aa13e-c49d-4af1-af22-0806839bdaab",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "Le numéro de réinitialisation n'est pas valide.",
        },
        {
          language: SupportedLanguage.En,
          text: "The token number is invalid.",
        },
      ],
    },
  },
  invalidUser: {
    uuid: "ea22ec99-8f44-4b89-b338-7d6b43320178",
    httpCode: StatusCodes.BAD_REQUEST,
    message: {
      translation: [
        {
          language: SupportedLanguage.Fr,
          text: "L'utilisateur n'est pas valide.",
        },
        {
          language: SupportedLanguage.En,
          text: "The user is invalid.",
        },
      ],
    },
  },
};
