export const sortTripEventsDurationTimeDown = (tripEventA, tripEventB) => {
  const durationTimeA = tripEventA.dateTo - tripEventA.dateFrom;
  const durationTimeB = tripEventB.dateTo - tripEventB.dateFrom;

  if (durationTimeA > durationTimeB) {
    return -1;
  }
  if (durationTimeA < durationTimeB) {
    return 1;
  }
  return 0;
};

export const sortPriceDown = (tripEventA, tripEventB) => tripEventB.basePrice - tripEventA.basePrice;

export const sortDefault = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;
