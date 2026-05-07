import { z } from "zod"
import { OhMyPatoniAgentConfigSchema } from "../src/config/schema"

export function createOhMyPatoniAgentJsonSchema(): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(OhMyPatoniAgentConfigSchema, {
    target: "draft-7",
    unrepresentable: "any",
  }) as Record<string, unknown>

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://raw.githubusercontent.com/gataungapainn/oh-my-patoniagent/dev/assets/oh-my-patoniagent.schema.json",
    title: "Oh My PatoniAgent Configuration",
    description: "Configuration schema for oh-my-patoniagent plugin",
    ...jsonSchema,
  }
}
