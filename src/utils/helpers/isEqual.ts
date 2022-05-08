import isArray from './isArray';
import isObject from './isObject';

type PlainObject<T = any> = {
  [k in string]: T;
};

function isEqual(lhs?: PlainObject, rhs?: PlainObject) {
  if (lhs === undefined && rhs === undefined) {
    return true;
  } else if (lhs === undefined || rhs === undefined) {
    return false;
  }

  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if ((isObject(value) || isArray(value)) && (isObject(rightValue) || isArray(rightValue))) {
      if (isEqual(value, rightValue)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}

export default isEqual;
