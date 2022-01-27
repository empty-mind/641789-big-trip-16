import {DESTINATIONS, OFFERS, generateDescriptions, generatePictures} from '../mock/trip-events.js'; // ???
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart-view.js';

const newTripEvent = {
  basePrice: 0,
  dateFrom: '01/01/22 00:00',
  dateTo: '01/01/22 00:00',
  destination:
  {
    description: 'Enter city to read description and view photos',
    name: 'Please enter city',
    pictures: [],
  },
  isFavorite: false,
  offers:
  {
    type: 'drive',
    offers: [
      {
        'id': 1,
        'title': 'Upgrade to a business class',
        'price': 0,
      },
    ],
    iconSrc: 'img/icons/drive.png',
  },
  type: 'drive',
  icon: 'img/icons/drive.png',
};

const getDestinationsList = () => {
  const destinationsList = DESTINATIONS.map((destinationCity) => ( // ???
    `<option value="${destinationCity}"></option>`
  ));

  return destinationsList.join('');
};

const createEditTripEventFormTemplate = (data) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = data;

  const renderOffersItem = (index) => (
    `<div class="event__available-offers">
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-${index}">
          <span class="event__offer-title">${offers.offers[index].title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offers.offers[index].price}</span>
        </label>
      </div>`
  );

  const renderOffers = (offersList) => {
    const offersHeader = '<h3 class="event__section-title  event__section-title--offers">Offers</h3>';
    let result = '';

    for (let index = 0; index < offersList.offers.length; index++) {
      result += renderOffersItem(index);
    }

    return offersHeader + result;
  };

  const renderPictureItem = (index) => (
    `<img class="event__photo" src="${destination.pictures[index].src}" alt="${destination.pictures[index].description}">`
  );

  const renderPictures = () => {
    let result = '';

    for (let index = 0; index < destination.pictures.length; index++) {
      result += renderPictureItem(index);
    }

    return result;
  };

  const humanizeDateFromValueEditFormInput = () => dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const humanizeDateToValueEditFormInput = () => dayjs(dateTo).format('DD/MM/YY HH:mm');

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${getDestinationsList()};
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateFromValueEditFormInput()}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateToValueEditFormInput()}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderOffers(offers)}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${renderPictures()}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
};

export default class EditTripEventFormView extends SmartView {
  #datepicker = new Map();

  constructor(tripEvent = newTripEvent) {
    super();
    this._data = tripEvent;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createEditTripEventFormTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  #setDatepicker = () => {
    if (this._data.dateFrom) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y/ H:i',
          defaultDate: this._data.dateFrom,
          enableTime: true,
          TIME_24HR: true,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
    if (this._data.dateTo) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y/ H:i',
          defaultDate: this._data.dateTo,
          enableTime: true,
          TIME_24HR: true,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  }

  setCloseClickHandler = (callback) => {
    this._callback.formEditClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formEditCloseClick);
  }

  #formEditCloseClick = (evt) => {
    evt.preventDefault();
    this._callback.formEditClose();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#tripEventTypeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
  }

  reset = (tripEvent) => {
    this.updateData(tripEvent);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseClickHandler(this._callback.formEditClose);
    this.#setDatepicker();
  }

  #tripEventTypeChangeHandler = (evt) => {
    this.updateData({
      offers: OFFERS.find((item) => item.type === evt.target.value), // ???
      type: evt.target.value,
      icon: `img/icons/${evt.target.value}.png`,
    });
  }

  #destinationChangeHandler = (evt) => {
    this.updateData({
      destination: {
        description: generateDescriptions(), // ???
        name: evt.target.value,
        pictures: generatePictures(), // ???
      }
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate,
    });
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate,
    });
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  #priceChangeHandler = (evt) => {
    this.updateData({
      basePrice: evt.target.value,
    });
  }
}
