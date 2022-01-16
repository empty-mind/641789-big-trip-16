import AbstractView from './abstract-view.js';

export const createLoadingTripEventsTemplate = () => (
  `<p class="trip-events__msg">
    Loading...
  </p>`
);

export default class LoadingTripEventsView extends AbstractView {
  get template() {
    return createLoadingTripEventsTemplate();
  }
}
