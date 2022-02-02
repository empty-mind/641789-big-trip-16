import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../utils/const.js';

export default class TripEventsModel extends AbstractObservable {
  #apiService = null;
  #tripEvents = [];
  #offers = [];
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get tripEvents() {
    return this.#tripEvents;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const tripEvents = await this.#apiService.tripEvents;
      this.#destinations = await this.#apiService.destinations;
      this.#offers = await this.#apiService.offers;
      this.#tripEvents = tripEvents.map(this.#adaptToClient);
    } catch (err) {
      this.#tripEvents = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateTripEvent = async (updateType, update) => {
    const index = this.#tripEvents.findIndex((tripEvent) => tripEvent.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    try {
      const response = await this.#apiService.updateTripEvent(update);
      const updatedTripEvent = this.#adaptToClient(response);

      this.#tripEvents = [
        ...this.#tripEvents.slice(0, index),
        updatedTripEvent,
        ...this.#tripEvents.slice(index + 1),
      ];

      this._notify(updateType, updatedTripEvent);
    } catch (err) {
      throw new Error('Can\'t update trip event');
    }
  }

  addTripEvent = async (updateType, update) => {
    try {
      const response = await this.#apiService.addTripEvent(update);
      const newTripEvent = this.#adaptToClient(response);
      this.#tripEvents = [newTripEvent, ...this.#tripEvents];
      this._notify(updateType, newTripEvent);
    } catch (err) {
      throw new Error('Can\'t add trip event');
    }
  }

  deleteTripEvent = async (updateType, update) => {
    const index = this.#tripEvents.findIndex((tripEvent) => tripEvent.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    try {
      await this.#apiService.deleteTripEvent(update);
      this.#tripEvents = [
        ...this.#tripEvents.slice(0, index),
        ...this.#tripEvents.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete trip event');
    }
  }

  #adaptToClient = (tripEvent) => {
    const adaptedTripEvent = {...tripEvent,
      basePrice: tripEvent['base_price'],
      dateFrom: new Date(tripEvent['date_from']),
      dateTo: new Date(tripEvent['date_to']),
      isFavorite: tripEvent['is_favorite'],
    };

    delete adaptedTripEvent['base_price'];
    delete adaptedTripEvent['date_from'];
    delete adaptedTripEvent['date_to'];
    delete adaptedTripEvent['is_favorite'];

    return adaptedTripEvent;
  }
}
