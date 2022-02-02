import dayjs from 'dayjs';
import he from 'he';
import AbstractView from './abstract-view.js';

const createOfferTemplate = (offers) => {
  return offers.map((offer) => (
    `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
    </li>`
  )).join('')
}

const createItemTripEventsTemplate = (tripEvent) => {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = tripEvent;

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

  const humanizeDateFromAttributeDayFilter = () => dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const humanizeDateFromDayFilter = () => dayjs(dateFrom).format('MMM D');

  const humanizeDateFromAttributeTimeFilter = () => dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const humanizeDateFromTimeFilter = () => dayjs(dateFrom).format('HH:mm');
  const humanizeDateToAttributeTimeFilter = () => dayjs(dateTo).format('YYYY-MM-DDTHH:mm');
  const humanizeDateToTimeFilter = () => dayjs(dateTo).format('HH:mm');

  const offersTemplate = createOfferTemplate(offers);

  const favoriteClassName = isFavorite
  ? 'event__favorite-btn--active'
  : '';

  return `<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${humanizeDateFromAttributeDayFilter()}">${humanizeDateFromDayFilter()}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
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
        ${offersTemplate}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
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
