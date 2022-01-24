import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';

const createItemTripEventsTemplate = (tripEvent) => {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type, icon} = tripEvent;

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const renderDurationTime = () => {
    let result = '';

    /* eslint-disable */
    const duration = require('dayjs/plugin/duration');
    dayjs.extend(duration);
    /* eslint-enable */

    const dateA = dayjs(dateFrom);
    const dateB = dayjs(dateTo);

    const durationTime = dayjs.duration(dateB.diff(dateA));
    const array = durationTime.format('DD:HH:mm').split(':');
    if (+array[0] !== 0) {
      result = `${array[0]}D ${array[1]}H ${array[2]}M`;
    }
    if (+array[0] === 0) {
      result = `${array[0] = ''}${array[1]}H ${array[2]}M`;
    }
    if (+array[0] === 0 && +array[1] === 0) {
      result = `${array[0] = ''}${array[1] = ''}${array[2]}M`;
    }

    return result;
  };

  const renderOffersItem = (index) => (
    `<li class="event__offer">
      <span class="event__offer-title">${offers.offers[index].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offers.offers[index].price}</span>
    </li>`
  );

  const renderOffers = (offersList) => {
    let result = '';

    for (let index = 0; index < offersList.offers.length; index++) {
      result += renderOffersItem(index);
    }

    return result;
  };

  const humanizeDateFromAttributeDayFilter = () => dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const humanizeDateFromDayFilter = () => dayjs(dateFrom).format('MMM D');

  const humanizeDateFromAttributeTimeFilter = () => dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const humanizeDateFromTimeFilter = () => dayjs(dateFrom).format('HH:mm');
  const humanizeDateToAttributeTimeFilter = () => dayjs(dateTo).format('YYYY-MM-DDTHH:mm');
  const humanizeDateToTimeFilter = () => dayjs(dateTo).format('HH:mm');

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDateFromAttributeDayFilter()}">${humanizeDateFromDayFilter()}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${icon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeDateFromAttributeTimeFilter()}">${humanizeDateFromTimeFilter()}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeDateToAttributeTimeFilter()}">${humanizeDateToTimeFilter()}</time>
        </p>
        <p class="event__duration">${renderDurationTime()}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${renderOffers(offers)}
      </ul>
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class ItemTripEventsView extends AbstractView {
  #tripEvent = null;

  constructor(tripEvent) {
    super();
    this.#tripEvent = tripEvent;
  }

  get template() {
    return createItemTripEventsTemplate(this.#tripEvent);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
