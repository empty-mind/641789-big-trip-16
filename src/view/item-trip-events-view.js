import {getRandomInteger} from '../utils/get-random-integer.js';
import {MIN_OFFERS_COUNT, MAX_OFFERS_COUNT} from '../utils/const.js';
import dayjs from 'dayjs';

export const createItemTripEventsTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type, icon} = point;

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const renderDurationTime = () => {
    let result = '';

    // на основе своих знаний не придумал лучше способа как посчитать и отформатировать временной промежуток
    /* eslint-disable */
    const duration = require('dayjs/plugin/duration');
    dayjs.extend(duration);
    /* eslint-enable */

    const durationTime = dayjs.duration(dateTo.diff(dateFrom));
    const array = durationTime.format('DD:HH:mm').split(':');
    if (+array[0] !== 0) {
      result = `${array[0] = ''}D ${array[1]}H ${array[2]}M`;
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

  const renderOffers = () => {
    let randomOffersCount = getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT);
    let result = '';

    if (offers.offers.length <= MAX_OFFERS_COUNT) {
      randomOffersCount = getRandomInteger(MIN_OFFERS_COUNT, offers.offers.length);
    }

    for (let index = 0; index < randomOffersCount; index++) {
      result += renderOffersItem(index);
    }

    return result;
  };

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom.format('YYYY-MM-DDTHH:mm')}">${dateFrom.format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${icon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom.format('YYYY-MM-DDTHH:mm')}">${dateFrom.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo.format('YYYY-MM-DDTHH:mm')}">${dateTo.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${renderDurationTime()}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${renderOffers()}
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
