import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
/** @ts-expect-error */
import betterAjvErrors from 'better-ajv-errors';

export function validate<T extends Record<string, unknown>>(
  schema: object,
  data: T,
): ValidateReturnType {
  const ajv = new Ajv({
    strict: true,
    coerceTypes: true,
    allErrors: true,
  });
  ajvFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(data);
  const errors = betterAjvErrors(schema, data, validate.errors ?? [], {
    format: 'js',
  });
  const error = errors.at(0);
  return {
    valid,
    error: error?.error?.trim?.(),
  };
}

interface ValidateReturnType {
  valid: boolean;
  error?: string;
}
