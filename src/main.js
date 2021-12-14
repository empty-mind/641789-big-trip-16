import {TRIP_EVENT_COUNT} from './utils/const.js';

import {renderTemplate, RenderPosition} from './utils/render.js';
import {createTripInfoTemplate} from './view/trip-info-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilterTripEventsTemplate} from './view/filter-trip-events-view.js';
import {createSortTripEventsTemplate} from './view/sort-trip-events-view.js';
import {createItemTripEventsTemplate} from './view/item-trip-events-view.js';
import {createListTripEventsTemplate} from './view/list-trip-events-view.js';
import {createEditPointFormTemplate} from './view/edit-point-form-view.js';
import {createNewPointFormTemplate} from './view/new-point-form-view.js';

// mock data
import {pointsDataMockArray} from './mock/point.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const sortTripEventsElement = document.querySelector('.trip-events');
const listTripEventsElement = document.querySelector('.trip-events');

const renderTripEvents = () => {
  let tripEvents = '';

  for (let index = 1; index < TRIP_EVENT_COUNT - 1; index++) {
    tripEvents += createItemTripEventsTemplate(pointsDataMockArray[index]);
  }

  return `${createEditPointFormTemplate(pointsDataMockArray[0])}
    ${tripEvents}
    ${createNewPointFormTemplate(pointsDataMockArray[TRIP_EVENT_COUNT - 1])}`;
};

renderTemplate(tripInfoElement, createTripInfoTemplate(pointsDataMockArray), RenderPosition.AFTERBEGIN);
renderTemplate(siteMenuElement, createSiteMenuTemplate());
renderTemplate(filterTripEventsElement, createFilterTripEventsTemplate());
renderTemplate(sortTripEventsElement, createSortTripEventsTemplate());
renderTemplate(listTripEventsElement, createListTripEventsTemplate(renderTripEvents));

/*
// empty - temp position
import {createEmptyTripEventsTemplate} from './view/empty-trip-events-view.js';
renderTemplate(contentTripEventsElement, createEmptyTripEventsTemplate(), RenderPosition.AFTEREND);

// loading - temp position
import {createLoadingTripEventsTemplate} from './view/loading-trip-events-view.js';
renderTemplate(contentTripEventsElement, createLoadingTripEventsTemplate(), RenderPosition.AFTEREND);

// stats
import {createStatisticsTemplate} from './view/statistics-view.js';
renderTemplate(contentTripEventsElement, createStatisticsTemplate(), RenderPosition.AFTEREND);
*/
