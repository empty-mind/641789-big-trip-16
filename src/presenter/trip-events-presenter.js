import {SortType, UpdateType, FilterType, UserAction} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import TripInfoView from '../view/trip-info-view.js';
import SortTripEventsView from '../view/sort-trip-events-view.js';
import ListTripEventsView from '../view/list-trip-events-view.js';
import EmptyTripEventsView from '../view/empty-trip-events-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import NewTripEventPresenter from './new-trip-event-presenter.js';

import {sortTripEventsDurationTimeDown, sortPriceDown, sortDefault} from '../utils/sort-type.js';

export default class TripEventsPresenter {
  #listTripEventsContainer = null;
  #tripInfoContainer = null;
  #tripEventsModel = null;
  #filterTripEventsModel = null;

  #sortTripEventsConponent = null;
  #listTripEventsComponent = new ListTripEventsView();
  #emptyTripEventsComponent = null;
  #filterType = FilterType.EVERYTHING;

  #tripEventPresenter = new Map();
  #newTripEventPresenter = null;
  #currentSortType = SortType.DEFAULT;

  constructor(listTripEventsContainer, tripInfoContainer, tripEventsModel, filterTripEventsModel) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripEventsModel = tripEventsModel;
    this.#filterTripEventsModel = filterTripEventsModel;

    this.#newTripEventPresenter = new NewTripEventPresenter(this.#listTripEventsComponent, this.#handleViewAction);

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterTripEventsModel.addObserver(this.#handleModelEvent);
  }

  get tripEvents() {
    this.#filterType = this.#filterTripEventsModel.filter;
    const tripEvents = this.#tripEventsModel.tripEvents;
    const filterTripEvents = filter[this.#filterType](tripEvents);

    switch (this.#currentSortType) {
      case SortType.DURATION_TIME_DOWN:
        return filterTripEvents.sort(sortTripEventsDurationTimeDown);
      case SortType.PRICE_DOWN:
        return filterTripEvents.sort(sortPriceDown);
      default:
        return filterTripEvents.sort(sortDefault);
    }
  }

  init = () => {
    if (this.tripEvents.length === 0) {
      this.#renderEmptyTripEvents();
    } else {
      this.#renderTripInfoView(this.tripEvents);
      this.#renderListTripEvents();
    }
  }

  // #sortTripEvents = (sortType) => {
  //   switch (sortType) {
  //     case SortType.DURATION_TIME_DOWN:
  //       this.tripEvents.sort(sortTripEventsDurationTimeDown);
  //       break;
  //     case SortType.PRICE_DOWN:
  //       this.tripEvents.sort(sortPriceDown);
  //       break;
  //     default:
  //       this.tripEvents.sort(sortDefault);
  //   }
  //   this.#currentSortType = sortType;
  // }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TRIP_EVENT:
        this.#tripEventsModel.updateTripEvent(updateType, update);
        break;
      case UserAction.ADD_TRIP_EVENT:
        this.#tripEventsModel.addTripEvent(updateType, update);
        break;
      case UserAction.DELETE_TRIP_EVENT:
        this.#tripEventsModel.deleteTripEvent(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripEventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripEventsList();
        this.#renderListTripEvents();
        break;
      case UpdateType.MAJOR:
        this.#clearTripEventsList({resetSortType: true});
        this.#renderListTripEvents();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripEventsList();
    this.#renderListTripEvents();
  }

  #handleModeChange = () => {
    this.#newTripEventPresenter.destroy();
    this.#tripEventPresenter.forEach((tripEvent) => tripEvent.resetView());
  }

  #renderTripInfoView = (tripEvents) => {
    const tripInfoComponent = new TripInfoView(tripEvents);
    render(this.#tripInfoContainer, tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  #renderSortTripEvents = () => {
    this.#sortTripEventsConponent = new SortTripEventsView();
    render(this.#listTripEventsContainer, this.#sortTripEventsConponent);
    this.#sortTripEventsConponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderListTripEvents = () => {
    const tripEvents = this.tripEvents;

    if (tripEvents.length === 0) {
      this.#renderEmptyTripEvents();
      return;
    }

    this.#renderSortTripEvents();
    render(this.#listTripEventsContainer, this.#listTripEventsComponent);
    this.#renderTripEvents(this.#listTripEventsComponent, tripEvents);
  }

  #clearTripEventsList = ({resetSortType = false} = {}) => {
    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();
    this.#newTripEventPresenter.destroy();

    remove(this.#sortTripEventsConponent);

    if (this.#emptyTripEventsComponent) {
      remove(this.#emptyTripEventsComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderItemTripEvents = (tripEventsListElement, tripEventComponent) => {
    const tripEventPresenter = new TripEventPresenter(tripEventsListElement, this.#handleViewAction, this.#handleModeChange);
    tripEventPresenter.init(tripEventComponent);
    this.#tripEventPresenter.set(tripEventComponent.id, tripEventPresenter);
  }

  #renderTripEvents = (tripEventsListElement, tripEvents) => {
    for (let index = 0; index < tripEvents.length; index++) {
      this.#renderItemTripEvents(tripEventsListElement, tripEvents[index]);
    }
  }

  #renderEmptyTripEvents = () => {
    this.#emptyTripEventsComponent = new EmptyTripEventsView(this.#filterType);
    render(this.#listTripEventsContainer, this.#emptyTripEventsComponent);
  }

  createPoint = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterTripEventsModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newTripEventPresenter.init();
  }
}
