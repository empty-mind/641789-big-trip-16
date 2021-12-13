export const createListTripEventsTemplate = (renderList) => (
  `<ul class="trip-events__list">
  ${renderList()}
  </ul>`
);
