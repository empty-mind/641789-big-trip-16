import AbstractView from './abstract-view.js';
import {FilterType} from '../utils/const.js';

const EmptyTripEventsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createEmptyTripEventsTemplate = (filterType) => {
  const emptyTripEventsTextValue = EmptyTripEventsTextType[filterType];

  return (`<p class="trip-events__msg">${emptyTripEventsTextValue}</p>`);
};

export default class EmptyTripEventsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEmptyTripEventsTemplate(this._data);
  }
}
