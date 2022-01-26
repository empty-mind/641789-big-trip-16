import {render} from './utils/render.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterTripEventsView from './view/filter-trip-events-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';

import TripEventsModel from './model/trip-events-model.js';

const TRIP_EVENTS_MOCK_ARRAY_LENGTH = 20;
import {generateTripEvent} from './mock/trip-events.js';

const tripEvents = Array.from({length: TRIP_EVENTS_MOCK_ARRAY_LENGTH}, generateTripEvent);

const tripEventsModel = new TripEventsModel();
tripEventsModel.tripEvents = tripEvents;

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const listTripEventsElement = document.querySelector('.trip-events');

render(siteMenuElement, new SiteMenuView());
render(filterTripEventsElement, new FilterTripEventsView());

const tripEventsPresenter = new TripEventsPresenter(listTripEventsElement, tripInfoElement, tripEventsModel);
tripEventsPresenter.init();

/*
// import NewTripEventFormView from './view/new-trip-event-form-view.js';
// trip event new form
render(listTripEventsComponent, new NewTripEventFormView(tripEvents[tripEvents.length - 1]));

// loading - temp position
import {createLoadingTripEventsTemplate} from './view/loading-trip-events-view.js';
renderTemplate(contentTripEventsElement, createLoadingTripEventsTemplate(), RenderPosition.AFTEREND);

// stats
import {createStatisticsTemplate} from './view/statistics-view.js';
renderTemplate(contentTripEventsElement, createStatisticsTemplate(), RenderPosition.AFTEREND);
*/
