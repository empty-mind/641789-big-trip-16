import {SortType} from '../utils/const.js';
import {RenderPosition, render} from '../utils/render.js';
import TripInfoView from '../view/trip-info-view.js';
import SortTripEventsView from '../view/sort-trip-events-view.js';
import ListTripEventsView from '../view/list-trip-events-view.js';
import EmptyTripEventsView from '../view/empty-trip-events-view.js';
import TripEventPresenter from './trip-event-presenter.js';

import {sortTripEventsDurationTimeDown, sortPriceDown, sortDefault} from '../utils/sort-type.js';

export default class TripEventsPresenter {
  #listTripEventsContainer = null;
  #tripInfoContainer = null;
  #tripEventsModel = null;

  #sortTripEventsConponent = new SortTripEventsView();
  #listTripEventsComponent = new ListTripEventsView();
  #emptyTripEventsComponent = new EmptyTripEventsView();

  #tripEventPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(listTripEventsContainer, tripInfoContainer, tripEventsModel) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripEventsModel = tripEventsModel;
  }

  get tripEvents() {
    return this.#tripEventsModel.tripEvents;
  }

  init = () => {
    if (this.tripEvents.length === 0) {
      this.#renderEmptyTripEvents();
    } else {
      this.#renderTripInfoView(this.tripEvents);
      this.#renderSortTripEvents();
      this.#renderListTripEvents();
    }
  }

  #sortTripEvents = (sortType) => {
    switch (sortType) {
      case SortType.DURATION_TIME_DOWN:
        this.tripEvents.sort(sortTripEventsDurationTimeDown);
        break;
      case SortType.PRICE_DOWN:
        this.tripEvents.sort(sortPriceDown);
        break;
      default:
        this.tripEvents.sort(sortDefault);
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTripEvents(sortType);
    this.#clearTripEventsList();
    this.#renderListTripEvents();
  }

  #handleModeChange = () => {
    this.#tripEventPresenter.forEach((tripEvent) => tripEvent.resetView());
  }

  #renderTripInfoView = (tripEvents) => {
    const tripInfoComponent = new TripInfoView(tripEvents);
    render(this.#tripInfoContainer, tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  #renderSortTripEvents = () => {
    render(this.#listTripEventsContainer, this.#sortTripEventsConponent);
    this.#sortTripEventsConponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderListTripEvents = () => {
    render(this.#listTripEventsContainer, this.#listTripEventsComponent);
    this.#renderTripEvents(this.#listTripEventsComponent, this.tripEvents);
  }

  #clearTripEventsList = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();
  }

  #handleItemTripEventsChange = (updateItemTripEvents) => {
    this.#tripEventPresenter.get(updateItemTripEvents.id).init(updateItemTripEvents);
  }

  #renderItemTripEvents = (tripEventsListElement, tripEventComponent) => {
    const tripEventPresenter = new TripEventPresenter(tripEventsListElement, this.#handleItemTripEventsChange, this.#handleModeChange);
    tripEventPresenter.init(tripEventComponent);
    this.#tripEventPresenter.set(tripEventComponent.id, tripEventPresenter);
  }

  #renderTripEvents = (tripEventsListElement, tripEvents) => {
    for (let index = 0; index < tripEvents.length; index++) {
      this.#renderItemTripEvents(tripEventsListElement, tripEvents[index]);
    }
  }

  #renderEmptyTripEvents = () => {
    render(this.#listTripEventsContainer, this.#emptyTripEventsComponent);
  }
}
