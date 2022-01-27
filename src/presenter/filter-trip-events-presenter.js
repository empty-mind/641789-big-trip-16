import FilterTripEventsView from '../view/filter-trip-events-view.js';
import {UpdateType, FilterType} from '../utils/const.js';
import {render, replace, remove} from '../utils/render.js';

export default class FilterTripEventsPresenter {
  #filterTripEventsContainer = null;
  #filterTripEventsModel = null;
  #filterTripEventsComponent = null;

  constructor(filterTripEventsContainer, filterTripEventsModel) {
    this.#filterTripEventsContainer = filterTripEventsContainer;
    this.#filterTripEventsModel = filterTripEventsModel;

    this.#filterTripEventsModel.addObserver(this.#handleModelEvent);
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
    const prevfilterTripEventsComponent = this.#filterTripEventsComponent;
    this.#filterTripEventsComponent = new FilterTripEventsView(filters, this.#filterTripEventsModel.filter);
    this.#filterTripEventsComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevfilterTripEventsComponent === null) {
      render(this.#filterTripEventsContainer, this.#filterTripEventsComponent);
      return;
    }

    replace(this.#filterTripEventsComponent, prevfilterTripEventsComponent);
    remove(prevfilterTripEventsComponent);
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
