import {createSortTripEventsTemplate} from './sort-trip-events-view.js';
import {createListTripEventsTemplate} from './list-trip-events-view.js';

export const createContentTripEvents = () => (
  `${createSortTripEventsTemplate()}
    ${createListTripEventsTemplate()}`
);
