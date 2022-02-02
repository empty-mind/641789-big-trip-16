import {render, remove} from './utils/render.js';
import {MenuItem} from './utils/const.js';

import FilterTripEventsModel from './model/filter-trip-events-model.js';
import TripEventsModel from './model/trip-events-model.js';

import SiteMenuView from './view/site-menu-view.js';
import StatisticsView from './view/statistics-view.js';

import TripInfoPresenter from './presenter/trip-info-presenter.js';
import FilterTripEventsPresenter from './presenter/filter-trip-events-presenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';


import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic lk46jklhjfdbnsah';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const listTripEventsElement = document.querySelector('.trip-events');
const newTripEventButton = document.querySelector('.trip-main__event-add-btn');

const tripEventsModel = new TripEventsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterTripEventsModel = new FilterTripEventsModel();

const siteMenuComponent = new SiteMenuView();

const tripInfoPresenter = new TripInfoPresenter(tripInfoElement, tripEventsModel);
const filterTripEventsPresenter = new FilterTripEventsPresenter(filterTripEventsElement, filterTripEventsModel, tripEventsModel);
const tripEventsPresenter = new TripEventsPresenter(listTripEventsElement, tripEventsModel, filterTripEventsModel, tripInfoPresenter);

const handleNewTripEventFormClose = () => {
  newTripEventButton.disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  const tableMenuElement = siteMenuElement.querySelector(`[data-menu-item="${MenuItem.TABLE}"]`);
  const statsMenuElement = siteMenuElement.querySelector(`[data-menu-item="${MenuItem.STATS}"]`);

  switch (menuItem) {
    case MenuItem.TABLE:
      filterTripEventsPresenter.init();
      tripEventsPresenter.init();
      remove(statisticsComponent);
      statsMenuElement.classList.remove('trip-tabs__btn--active');
      tableMenuElement.classList.add('trip-tabs__btn--active');
      break;
    case MenuItem.STATS:
      filterTripEventsPresenter.destroy();
      tripEventsPresenter.destroy();
      tableMenuElement.classList.remove('trip-tabs__btn--active');
      statsMenuElement.classList.add('trip-tabs__btn--active');
      statisticsComponent = new StatisticsView(tripEventsModel.tripEvents);
      render(listTripEventsElement, statisticsComponent);
      break;
    case MenuItem.NEW_EVENT:
      remove(statisticsComponent);
      filterTripEventsPresenter.destroy();
      filterTripEventsPresenter.init();
      tripEventsPresenter.destroy();
      tripEventsPresenter.init();
      statsMenuElement.classList.remove('trip-tabs__btn--active');
      tableMenuElement.classList.add('trip-tabs__btn--active');
      tripEventsPresenter.createPoint(handleNewTripEventFormClose);
      newTripEventButton.disabled = true;
      break;
  }
};

newTripEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.NEW_EVENT);
});

tripEventsPresenter.init();

tripEventsModel.init().finally(() => {
  render(siteMenuElement, siteMenuComponent);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  tripInfoPresenter.init();
  filterTripEventsPresenter.init();
});
