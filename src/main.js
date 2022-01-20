import {RenderPosition, render} from './utils/render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterTripEventsView from './view/filter-trip-events-view.js';
// import NewTripEventFormView from './view/new-trip-event-form-view.js'; // временно отключил
import TripEventsPresenter from './presenter/trip-events-presenter.js';

import {TRIP_EVENTS_MOCK_ARRAY_LEGTH} from './mock/const.js';
import {generateTripEvent} from './mock/trip-events.js';

const tripEvents = Array.from({length: TRIP_EVENTS_MOCK_ARRAY_LEGTH}, generateTripEvent);

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const listTripEventsElement = document.querySelector('.trip-events');

render(tripInfoElement, new TripInfoView(tripEvents), RenderPosition.AFTERBEGIN);
render(siteMenuElement, new SiteMenuView());
render(filterTripEventsElement, new FilterTripEventsView());

const tripEventsPresenter = new TripEventsPresenter(listTripEventsElement);
tripEventsPresenter.init(tripEvents);

/*
// trip event new form
render(listTripEventsComponent, new NewTripEventFormView(tripEvents[tripEvents.length - 1]));

// loading - temp position
import {createLoadingTripEventsTemplate} from './view/loading-trip-events-view.js';
renderTemplate(contentTripEventsElement, createLoadingTripEventsTemplate(), RenderPosition.AFTEREND);

// stats
import {createStatisticsTemplate} from './view/statistics-view.js';
renderTemplate(contentTripEventsElement, createStatisticsTemplate(), RenderPosition.AFTEREND);
*/
