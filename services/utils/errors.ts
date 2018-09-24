'user sctrict';
export class NonNullableGraphQLError extends Error {
  constructor(missingField: string) {
    super(`${missingField}`);

    // work around
    // https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
    Object.setPrototypeOf(this, NonNullableGraphQLError.prototype);
  }
}

// const error = new NonNullableGraphQLError("abc");
// if (error instanceof NonNullableGraphQLError) {
//   console.log(error);
// }
