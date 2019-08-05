export const isNull = value => {
  return value === null;
};
export const isUndefined = value => {
  return typeof value === "undefined";
};
export const isString = value => {
  return typeof value === "string" || value instanceof String;
};
export const isNumber = value => {
  return typeof value === "number" && isFinite(value);
};
export const isBoolean = value => {
  return typeof value === "boolean";
};
export const isRegExp = value => {
  return value && typeof value === "object" && value.constructor === RegExp;
};
export const isDate = value => {
  return value instanceof Date;
};
export const isSymbol = value => {
  return typeof value === "symbol";
};
export const isObject = value => {
  return value && typeof value === "object" && value.constructor === Object;
};
export const isArray = value => {
  return value && typeof value === "object" && value.constructor === Array;
};
export const isFunction = value => {
  return typeof value === "function";
};
export const isError = value => {
  return value instanceof Error && typeof value.message !== "undefined";
};

export const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const toCamelCase = str => {
  return str
    .replace(/[-_]+(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    })
    .replace(/-/g, "")
    .replace(/_/g, "")
    .replace(/\s+/g, "");
};
export const toSnakeCase = string => {
  return string
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .toLowerCase();
};
export const toKebabCase = string => {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
};
export const toPlainLowercase = string => {
  return string
    .replace(/([a-z])([A-Z])/g, "$1$2")
    .replace(/\s+/g, "-")
    .replace(/-/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
};

export const objectToPlainLowercase = obj => {
  Object.keys(obj).map(key => {
    //check if object
    if (isObject(obj[key])) {
      objectToCamelCase(obj[key]);
    }
    let new_key = toPlainLowercase(key);
    if (key !== new_key) {
      Object.defineProperty(
        obj,
        new_key,
        Object.getOwnPropertyDescriptor(obj, key)
      );
      delete obj[key];
    }
  });

  return obj;
};

export const objectToCamelCase = obj => {
  Object.keys(obj).map(key => {
    //check if object
    if (isObject(obj[key])) {
      objectToCamelCase(obj[key]);
    }
    if (isArray(obj[key])) {
      objectToCamelCase(obj[key]);
    }
    let new_key = toCamelCase(key);
    if (key !== new_key) {
      Object.defineProperty(
        obj,
        new_key,
        Object.getOwnPropertyDescriptor(obj, key)
      );
      delete obj[key];
    }
  });

  return obj;
};
