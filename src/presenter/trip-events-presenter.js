import {updateItem} from '../utils/common.js';
import {render} from '../utils/render.js';
import SortTripEventsView from '../view/sort-trip-events-view.js';
import ListTripEventsView from '../view/list-trip-events-view.js';
import EmptyTripEventsView from '../view/empty-trip-events-view.js';
import TripEventPresenter from './trip-event-presenter.js';

const TRIP_EVENT_COUNT = 20;

export default class TripEventsPresenter {
  #listTripEventsContainer = null;

  #sortTripEventsConponent = new SortTripEventsView();
  #listTripEventsComponent = new ListTripEventsView();
  #emptyTripEventsComponent = new EmptyTripEventsView();

  #tripEvents = [];
  #tripEventPresenter = new Map();

  constructor(listTripEventsContainer) {
    this.#listTripEventsContainer = listTripEventsContainer;
  }

  init = (tripEvents) => {
    this.#tripEvents = [...tripEvents];

    if (this.#tripEvents.length === 0) {
      this.#renderEmptyTripEvents();
    } else {
      this.#renderSortTripEvents();
      this.#renderListTripEvents();
    }
  }

  #handleModeChange = () => {
    this.#tripEventPresenter.forEach((tripEvent) => tripEvent.resetView());
  }

  #renderSortTripEvents = () => {
    render(this.#listTripEventsContainer, this.#sortTripEventsConponent);
  }

  #renderListTripEvents = () => {
    render(this.#listTripEventsContainer, this.#listTripEventsComponent);
    this.#renderTripEvents(this.#listTripEventsComponent, this.#tripEvents);
  }

  #handleItemTripEventsChange = (updateItemTripEvents) => {
    this.#tripEvents = updateItem(this.#tripEvents, updateItemTripEvents);
    this.#tripEventPresenter.get(updateItemTripEvents.id).init(updateItemTripEvents);
  }

  #renderItemTripEvents = (tripEventsListElement, tripEventComponent) => {
    const tripEventPresenter = new TripEventPresenter(tripEventsListElement, this.#handleItemTripEventsChange, this.#handleModeChange);
    tripEventPresenter.init(tripEventComponent);
    this.#tripEventPresenter.set(tripEventComponent.id, tripEventPresenter);
  }

  #renderTripEvents = (tripEventsListElement, tripEvents) => {
    for (let index = 0; index < TRIP_EVENT_COUNT; index++) {
      this.#renderItemTripEvents(tripEventsListElement, tripEvents[index]);
    }
  }

  #renderEmptyTripEvents = () => {
    render(this.#listTripEventsContainer, this.#emptyTripEventsComponent);
  }
}
