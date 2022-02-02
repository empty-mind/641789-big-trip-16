import FilterTripEventsView from '../view/filter-trip-events-view.js';
import {UpdateType, FilterType} from '../utils/const.js';
import {render, replace, remove} from '../utils/render.js';

export default class FilterTripEventsPresenter {
  #filterTripEventsContainer = null;
  #filterTripEventsModel = null;
  #filterTripEventsComponent = null;
  #tripEventsModel = null;

  constructor(filterTripEventsContainer, filterTripEventsModel, tripEventsModel) {
    this.#filterTripEventsContainer = filterTripEventsContainer;
    this.#filterTripEventsModel = filterTripEventsModel;
    this.#tripEventsModel = tripEventsModel;
  }

  get filters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything'
      },
      {
        type: FilterType.FUTURE,
        name: 'Future'
      },
      {
        type: FilterType.PAST,
        name: 'Past'
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterTripEventsComponent = this.#filterTripEventsComponent;

    this.#filterTripEventsComponent = new FilterTripEventsView(filters, this.#filterTripEventsModel.filter, this.#tripEventsModel.tripEvents);
    this.#filterTripEventsComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterTripEventsModel.addObserver(this.#handleModelEvent);

    if (prevFilterTripEventsComponent === null) {
      render(this.#filterTripEventsContainer, this.#filterTripEventsComponent);
      return;
    }

    replace(this.#filterTripEventsComponent, prevFilterTripEventsComponent);
    remove(prevFilterTripEventsComponent);
  }

  destroy = () => {
    remove(this.#filterTripEventsComponent);
    this.#filterTripEventsComponent = null;
    this.#tripEventsModel.removeObserver(this.#handleModelEvent);
    this.#filterTripEventsModel.removeObserver(this.#handleModelEvent);

    this.#filterTripEventsModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterTripEventsModel.filter === filterType) {
      return;
    }
    this.#filterTripEventsModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
