import {createElement} from '../utils/render';

export const createLoadingTripEventsTemplate = () => (
  `<p class="trip-events__msg">
    Loading...
  </p>`
);

export default class LoadingTripEventsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createLoadingTripEventsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
