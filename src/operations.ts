import * as assert from "assert";
import { NotFoundError, ValidationError } from "@aidbox/node-server-sdk";
import { TOperation } from "./helpers";
import { fromFirstClassExtension, toFirstClassExtension } from "sdc-qrf";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4b";
import {
  Questionnaire as FCEQuestionnaire,
  QuestionnaireResponse as FCEQuestionnaireResponse,
} from "@beda.software/aidbox-types";

export const toAidboxFormat: TOperation<{
  // Typing "resource" (POST payload)
  // resource: Questionnaire | QuestionnaireResponse;
  resource: any;
}> = {
  method: "POST",
  path: ["$to-format", "aidbox"],
  handlerFn: async (req, { ctx }) => {
    const { resource } = req;
    assert.ok(resource, new ValidationError("resource required"));

    if (resource.resourceType === "Bundle") {
      const fceEntries = resource.entry.map((entry: any) => ({
        ...entry,
        resource: toFirstClassExtension(entry.resource),
      }));
      return {
        resource: {
          resource: {
            ...resource,
            entry: fceEntries,
          },
          status: 200,
        },
      };
    }

    const fceResource = toFirstClassExtension(resource);
    return { resource: { resource: fceResource }, status: 200 };
  },
};

export const toFHIRFormat: TOperation<{
  resource: any;
}> = {
  method: "POST",
  path: ["$to-format", "fhir"],
  handlerFn: async (req, { ctx }) => {
    const { resource } = req;
    assert.ok(resource, new ValidationError("resource required"));

    if (resource.resourceType === "Bundle") {
      const fhirEntries = resource.entry.map((entry: any) => ({
        ...entry,
        resource: fromFirstClassExtension(entry.resource),
      }));
      return {
        resource: {
          resource: {
            ...resource,
            entry: fhirEntries,
          },
          status: 200,
        },
      };
    }

    const fhirResource = fromFirstClassExtension(resource);
    return { resource: { resource: fhirResource }, status: 200 };
  },
};
