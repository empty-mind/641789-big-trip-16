import AbstractView from './abstract-view.js';
import {filter as filterFunction} from '../utils/filter.js';

const createFilterItemTemplate = (filter, currentFilterType, tripEvents) => {
  const {type, name} = filter;
  const filteredTripEvents = filterFunction[type](tripEvents).length;
  return (`<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''}
    ${filteredTripEvents ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
  </div>`);
};

const createFilterTripEventsTemplate = (filterItems, currentFilterType, tripEvents) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType, tripEvents)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
  </form>`;
};

export default class FilterTripEventsView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #tripEvents = null;

  constructor(filters, currentFilterType, tripEvents) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#tripEvents = tripEvents;
  }

  get template() {
    return createFilterTripEventsTemplate(this.#filters, this.#currentFilter, this.#tripEvents);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
