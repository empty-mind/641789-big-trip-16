import {render, RenderPosition} from './utils/render.js';
import TripInfoView from './view/trip-info-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilterTripEventsView from './view/filter-trip-events-view.js';
import SortTripEventsView from './view/sort-trip-events-view.js';
import ItemTripEventsView from './view/item-trip-events-view.js';
import ListTripEventsView from './view/list-trip-events-view.js';
import EditTripEventFormView from './view/edit-trip-event-form-view.js';
import NewTripEventFormView from './view/new-trip-event-form-view.js';
import EmptyTripEventsView from './view/empty-trip-events-view.js';

import {TRIP_EVENT_COUNT} from './mock/const.js';
import {tripEventsDataMockArray} from './mock/trip-events.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const siteMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const filterTripEventsElement = siteHeaderElement.querySelector('.trip-controls__filters');
const sortTripEventsElement = document.querySelector('.trip-events');
const listTripEventsElement = document.querySelector('.trip-events');

if (tripEventsDataMockArray.length === 0) {
  render(listTripEventsElement, new EmptyTripEventsView().element);
} else {
  render(tripInfoElement, new TripInfoView(tripEventsDataMockArray).element, RenderPosition.AFTERBEGIN);
  render(siteMenuElement, new SiteMenuView().element);
  render(filterTripEventsElement, new FilterTripEventsView().element);
  render(sortTripEventsElement, new SortTripEventsView().element);

  const listTripEventsComponent = new ListTripEventsView();
  render(listTripEventsElement, listTripEventsComponent.element);

  const renderTripEvent = (ripEventsListElement, itemTripEvent) => {
    const tripEventComponent = new ItemTripEventsView(itemTripEvent);
    const tripEventEditComponent = new EditTripEventFormView(itemTripEvent);

    const replaceItemTripEventToEditTripEventForm = () => {
      ripEventsListElement.replaceChild(tripEventEditComponent.element, tripEventComponent.element);
    };

    const replaceEditTripEventFormToItemTripEvent = () => {
      ripEventsListElement.replaceChild(tripEventComponent.element, tripEventEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditTripEventFormToItemTripEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripEventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceItemTripEventToEditTripEventForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripEventEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditTripEventFormToItemTripEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripEventEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditTripEventFormToItemTripEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(ripEventsListElement, tripEventComponent.element);
  };

  for (let index = 0; index < TRIP_EVENT_COUNT; index++) {
    renderTripEvent(listTripEventsComponent.element, tripEventsDataMockArray[index]);
  }

  // форма добавления новой точки марштура - пока просто добавлена в конец списка
  render(listTripEventsComponent.element, new NewTripEventFormView(tripEventsDataMockArray[tripEventsDataMockArray.length - 1]).element);
}

/*
// loading - temp position
import {createLoadingTripEventsTemplate} from './view/loading-trip-events-view.js';
renderTemplate(contentTripEventsElement, createLoadingTripEventsTemplate(), RenderPosition.AFTEREND);

// stats
import {createStatisticsTemplate} from './view/statistics-view.js';
renderTemplate(contentTripEventsElement, createStatisticsTemplate(), RenderPosition.AFTEREND);
*/
