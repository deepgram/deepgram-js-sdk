/**
 * Simple serializer that replaces values with type placeholders for non-deterministic testing
 * Perfect for AI APIs where response content varies but structure should remain consistent
 */
export const structureOnlySerializer = {
  test: (val: any) => val != null && typeof val === "object",
  serialize: (val: any) => {
    const replaceValues = (obj: any): any => {
      if (obj === null) return null;
      if (obj === undefined) return undefined;
      if (typeof obj === "string") return "<string>";
      if (typeof obj === "number") return "<number>";
      if (typeof obj === "boolean") return "<boolean>";

      if (Array.isArray(obj)) {
        return obj.length > 0 ? [replaceValues(obj[0])] : [];
      }

      if (typeof obj === "object") {
        const result: any = {};
        for (const key of Object.keys(obj).sort()) {
          result[key] = replaceValues(obj[key]);
        }
        return result;
      }

      return obj;
    };

    return JSON.stringify(replaceValues(val), null, 2);
  },
};
