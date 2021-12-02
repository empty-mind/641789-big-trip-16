import {TRIP_EVENT_COUNT} from '../utils/constans.js';
import {createItemTripEventsTemplate} from './item-trip-events-view.js';
import {createNewPointFormTemplate} from './new-point-form-view.js';
import {createEditPointFormTemplate} from './edit-point-form-view.js';

const renderTripEvents = () => {
  let tripEvents = '';
  for (let index = 0; index < TRIP_EVENT_COUNT; index++) {
    tripEvents += createItemTripEventsTemplate();
  }
  return tripEvents;
};

export const createListTripEventsTemplate = () => (
  `<ul class="trip-events__list">
  ${createEditPointFormTemplate()}
  ${renderTripEvents()}
  ${createNewPointFormTemplate()}
  </ul>`
);
