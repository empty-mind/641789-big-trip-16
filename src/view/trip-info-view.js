import AbstractView from './abstract-view.js';

const createTripInfoTemplate = (dataArray) => {
  const renderTripInfoTitle = () => {
    const firstTripEvent = dataArray[0].destination.name;
    const secondTripEvent = dataArray[1].destination.name;
    const lastTripEvent = dataArray[dataArray.length - 2].destination.name;

    if (dataArray.length < 3) {
      return `<h1 class="trip-info__title">${firstTripEvent} &mdash; ${lastTripEvent}</h1>`;
    }
    if (dataArray.length === 3) {
      return `<h1 class="trip-info__title">${firstTripEvent} &mdash; ${secondTripEvent} &mdash; ${lastTripEvent}</h1>`;
    }

    return `<h1 class="trip-info__title">${firstTripEvent} &mdash; ... &mdash; ${lastTripEvent}</h1>`;
  };

  const renderTripInfoDates = () => (
    `<p class="trip-info__dates">
    ${dataArray[0].dateFrom.format('MMM DD').toUpperCase()}&nbsp;&mdash;&nbsp;
    ${dataArray[0].dateTo.format('MMM DD').toUpperCase()}
    </p>`
  );

  const getTripInfoCost = () => {
    let result = 0;

    for (let index = 0; index < dataArray.length - 1; index++){
      result += dataArray[index].basePrice;
    }

    return result;
  };

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
      ${renderTripInfoTitle()}
      ${renderTripInfoDates()}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripInfoCost()}</span>
    </p>
  </section>`;
};

export default class TripInfoView extends AbstractView {
  #tripEvents = null;

  constructor(dataArray) {
    super();
    this.#tripEvents = dataArray;
  }

  get template() {
    return createTripInfoTemplate(this.#tripEvents);
  }
}
