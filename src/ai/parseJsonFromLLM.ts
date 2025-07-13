import { ZodSchema } from 'zod';

/**
 * Parses JSON-like output from an LLM, removing markdown code fences if needed,
 * and optionally validating with a Zod schema.
 *
 * @param raw - The raw string from the LLM.
 * @param schema - Optional Zod schema to validate the parsed object.
 * @returns The parsed (and validated) object.
 */
export function parseJsonFromLLM<T>(raw: string, schema?: ZodSchema<T>): T {
  const cleaned = raw
    .replace(/^\s*```(?:json)?\s*/i, '') // Remove starting ```json
    .replace(/\s*```$/, '')              // Remove ending ```
    .trim();

  let parsed: any;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('❌ Failed to parse JSON:\n', raw);
    throw new Error(`Failed to parse JSON: ${(err as Error).message}`);
  }

  if (schema) {
    try {
      return schema.parse(parsed);
    } catch (err) {
      console.error('❌ Parsed JSON failed schema validation:\n', parsed);
      throw err;
    }
  }

  return parsed;
}
