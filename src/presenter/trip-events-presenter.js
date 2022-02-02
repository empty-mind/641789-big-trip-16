import {sortTripEventsDurationTimeDown, sortPriceDown, sortDefault} from '../utils/sort-type.js';
import {SortType, UpdateType, FilterType, UserAction} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import SortTripEventsView from '../view/sort-trip-events-view.js';
import ListTripEventsView from '../view/list-trip-events-view.js';
import EmptyTripEventsView from '../view/empty-trip-events-view.js';
import TripEventPresenter, {State as TripEventPresenterViewState} from './trip-event-presenter.js';
import NewTripEventPresenter from './new-trip-event-presenter.js';
import LoadingTripEventsView from '../view/loading-trip-events-view.js';

export default class TripEventsPresenter {
  #listTripEventsContainer = null;
  #tripEventsModel = null;
  #filterTripEventsModel = null;

  #sortTripEventsComponent = null;
  #listTripEventsComponent = new ListTripEventsView();
  #loadingComponent = new LoadingTripEventsView();
  #emptyTripEventsComponent = null;
  #filterType = FilterType.EVERYTHING;

  #tripEventPresenter = new Map();
  #newTripEventPresenter = null;
  #tripInfoPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  constructor(listTripEventsContainer, tripEventsModel, filterTripEventsModel, tripInfoPresenter) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#tripEventsModel = tripEventsModel;
    this.#filterTripEventsModel = filterTripEventsModel;
    this.#tripInfoPresenter = tripInfoPresenter;
    this.#newTripEventPresenter = new NewTripEventPresenter(this.#tripEventsModel, this.#listTripEventsComponent, this.#handleViewAction);
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

  get offers() {
    const offers = this.#tripEventsModel.offers;
    return offers;
  }

  get destinations() {
    const destinations = this.#tripEventsModel.destinations;
    return destinations;
  }

  init = () => {
    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterTripEventsModel.addObserver(this.#handleModelEvent);
    this.#currentSortType = SortType.DEFAULT;
    this.#renderListTripEvents();
  }

  destroy = () => {
    this.#clearTripEventsList(true);
    remove(this.#sortTripEventsComponent);
    remove(this.#listTripEventsComponent);

    this.#tripEventsModel.removeObserver(this.#handleModelEvent);
    this.#filterTripEventsModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = (callback) => {
    this.#newTripEventPresenter.init(callback);
  }

  #handleModeChange = () => {
    this.#newTripEventPresenter.destroy();
    this.#tripEventPresenter.forEach((tripEvent) => tripEvent.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TRIP_EVENT:
        this.#tripEventPresenter.get(update.id).setViewState(TripEventPresenterViewState.SAVING);
        try {
          await this.#tripEventsModel.updateTripEvent(updateType, update);
        } catch (err) {
          this.#tripEventPresenter.get(update.id).setViewState(TripEventPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_TRIP_EVENT:
        this.#newTripEventPresenter.setSaving();
        try {
          await this.#tripEventsModel.addTripEvent(updateType, update);
        } catch (err) {
          this.#newTripEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TRIP_EVENT:
        this.#tripEventPresenter.get(update.id).setViewState(TripEventPresenterViewState.DELETING);
        try {
          await this.#tripEventsModel.deleteTripEvent(updateType, update);
        } catch (err) {
          this.#tripEventPresenter.get(update.id).setViewState(TripEventPresenterViewState.ABORTING);
        }
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
        this.#tripInfoPresenter.destroy();
        this.#tripInfoPresenter.init();
        break;
      case UpdateType.MAJOR:
        this.#clearTripEventsList();
        this.#renderListTripEvents({resetSortType: true});
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderSortTripEvents = () => {
    this.#sortTripEventsComponent = new SortTripEventsView(this.#currentSortType);
    render(this.#listTripEventsContainer, this.#sortTripEventsComponent);
    this.#sortTripEventsComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearSort = () => {
    remove(this.#sortTripEventsComponent);
  }

  #renderItemTripEvents = (tripEventsComponent) => {
    const tripEventPresenter = new TripEventPresenter(this.offers, this.destinations, this.#listTripEventsComponent, this.#handleViewAction, this.#handleModeChange);
    tripEventPresenter.init(tripEventsComponent);
    this.#tripEventPresenter.set(tripEventsComponent.id, tripEventPresenter);
  }

  #renderTripEvents = (tripEvents) => {
    render(this.#listTripEventsContainer, this.#listTripEventsComponent);
    tripEvents.forEach((tripEvent) => this.#renderItemTripEvents(tripEvent));
  }

  #renderLoading = () => {
    render(this.#listTripEventsContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderEmptyTripEvents = () => {
    this.#emptyTripEventsComponent = new EmptyTripEventsView(this.#filterType);
    render(this.#listTripEventsContainer, this.#emptyTripEventsComponent);
  }

  #clearTripEventsList = ({resetSortType = false} = {}) => {
    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();
    this.#newTripEventPresenter.destroy();

    this.#clearSort();
    remove(this.#loadingComponent);
    remove(this.#emptyTripEventsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderListTripEvents = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const tripEvents = this.tripEvents;

    if (tripEvents.length === 0) {
      this.#renderEmptyTripEvents();
      return;
    }

    this.#clearSort();
    this.#renderSortTripEvents();
    this.#renderTripEvents(tripEvents);
  }
}
