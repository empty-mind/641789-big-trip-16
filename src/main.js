import {RenderPosition, render, remove} from './utils/render.js';
import {MenuItem} from './utils/const.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import StatisticsView from './view/statistics-view.js';

import FilterTripEventsPresenter from './presenter/filter-trip-events-presenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';

import FilterTripEventsModel from './model/filter-trip-events-model.js';
import TripEventsModel from './model/trip-events-model.js';

const TRIP_EVENTS_MOCK_ARRAY_LENGTH = 20;
import {generateTripEvent} from './mock/trip-events.js';

const tripEvents = Array.from({length: TRIP_EVENTS_MOCK_ARRAY_LENGTH}, generateTripEvent);

const tripInfoComponent = new TripInfoView(tripEvents);
const siteMenuComponent = new SiteMenuView();
const filterTripEventsModel = new FilterTripEventsModel();
const tripEventsModel = new TripEventsModel();
tripEventsModel.tripEvents = tripEvents;

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const listTripEventsElement = document.querySelector('.trip-events');

render(tripInfoElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(siteMenuElement, siteMenuComponent);

const filterTripEventsPresenter = new FilterTripEventsPresenter(filterTripEventsElement, filterTripEventsModel);
filterTripEventsPresenter.init();

const tripEventsPresenter = new TripEventsPresenter(listTripEventsElement, tripEventsModel, filterTripEventsModel);
tripEventsPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripEventsPresenter.createPoint();
});

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      filterTripEventsPresenter.init();
      tripEventsPresenter.init();
      break;
    case MenuItem.STATS:
      filterTripEventsPresenter.destroy();
      tripEventsPresenter.destroy();
      statisticsComponent = new StatisticsView(tripEventsModel.tripEvents);
      render(listTripEventsElement, statisticsComponent);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

//===========
/*
// loading - temp position
import {createLoadingTripEventsTemplate} from './view/loading-trip-events-view.js';
renderTemplate(contentTripEventsElement, createLoadingTripEventsTemplate(), RenderPosition.AFTEREND);

// stats
import {createStatisticsTemplate} from './view/statistics-view.js';
renderTemplate(contentTripEventsElement, createStatisticsTemplate(), RenderPosition.AFTEREND);
*/
