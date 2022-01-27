import {FilterType} from './const.js';

const isFuture = (dateFrom) => dateFrom >= new Date();

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => !isFuture(point.dateFrom)),
};
