import AbstractView from './abstract-view.js';

const createListTripEventsTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class ListTripEventsView extends AbstractView {
  get template() {
    return createListTripEventsTemplate();
  }
}
