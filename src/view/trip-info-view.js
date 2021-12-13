export const createTripInfoTemplate = (dataArray) => {
  const renderTripInfotitle = () => {
    const firstPoint = dataArray[0].destination.name;
    const secondPoint = dataArray[1].destination.name;
    const lastPoint = dataArray[dataArray.length - 2].destination.name;

    if (dataArray.length < 3) {
      return `<h1 class="trip-info__title">${firstPoint} &mdash; ${lastPoint}</h1>`;
    }
    if (dataArray.length === 3) {
      return `<h1 class="trip-info__title">${firstPoint} &mdash; ${secondPoint} &mdash; ${lastPoint}</h1>`;
    }

    return `<h1 class="trip-info__title">${firstPoint} &mdash; ... &mdash; ${lastPoint}</h1>`;
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
      ${renderTripInfotitle()}
      ${renderTripInfoDates()}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripInfoCost()}</span>
    </p>
  </section>`;
};
