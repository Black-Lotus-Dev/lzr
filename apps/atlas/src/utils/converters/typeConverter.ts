import _ from 'lodash';

// this function is used to convert the given value to the given generic type
// this function also removes properties that are not in the given generic type

export default function convertTo<T>(value: any, keys: string[]): T {
  return _.pick(value, keys) as T;
}
