import {renderTemplate, RenderPosition} from './utils/render.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilterTripEventsTemplate} from './view/filter-trip-events-view.js';
import {createContentTripEvents} from './view/content-trip-events-view.js';
import {createTripInfoTemplate} from './view/trip-info-view.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main');
const contentTripEventsElement = document.querySelector('.trip-events');

renderTemplate(siteMenuElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filterTripEventsElement, createFilterTripEventsTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripInfoElement, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(contentTripEventsElement, createContentTripEvents(), RenderPosition.BEFOREEND);

// empty - temp position
import {createEmptyTripEventsTemplate} from './view/empty-trip-events-view.js';
renderTemplate(contentTripEventsElement, createEmptyTripEventsTemplate(), RenderPosition.AFTEREND);

// loading - temp position
import {createLoadingTripEventsTemplate} from './view/loading-trip-events-view.js';
renderTemplate(contentTripEventsElement, createLoadingTripEventsTemplate(), RenderPosition.AFTEREND);

// stats
import {createStatisticsTemplate} from './view/statistics-view.js';
renderTemplate(contentTripEventsElement, createStatisticsTemplate(), RenderPosition.AFTEREND);
