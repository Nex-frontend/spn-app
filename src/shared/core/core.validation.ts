import { IsFunction } from './core.interface';

export const isFunction = <T extends any>(value?: T): value is IsFunction<T> => {
  return typeof value === 'function';
};

export const isObject = <T extends Object>(value: any): value is T => {
  return typeof value === 'object' && typeof value !== 'function' && value != undefined;
};

export const isEmpty = <T extends Object>(obj?: T) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
