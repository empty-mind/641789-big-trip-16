import {createElement} from '../utils/render';

const createListTripEventsTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class ListTripEventsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createListTripEventsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
