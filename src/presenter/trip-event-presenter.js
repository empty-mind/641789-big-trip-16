import {render, replace, remove} from '../utils/render.js';
import ItemTripEventsView from '../view/item-trip-events-view.js';
import EditTripEventFormView from '../view/edit-trip-event-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripEventPresenter {
  #listTripEventsContainer = null;
  #changeData = null;
  #changeMode = null;

  #itemTripEventsComponent = null;
  #editTripEventFormComponent = null;

  #tripEventsComponent = null;
  #mode = Mode.DEFAULT;

  constructor(listTripEventsContainer, changeData, changeMode) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (tripEventsComponent) => {
    this.#tripEventsComponent = tripEventsComponent;

    const prevItemTripEventsComponent = this.#itemTripEventsComponent;
    const prevEditTripEventFormComponent = this.#editTripEventFormComponent;

    this.#itemTripEventsComponent = new ItemTripEventsView(tripEventsComponent);
    this.#editTripEventFormComponent = new EditTripEventFormView(tripEventsComponent);

    this.#itemTripEventsComponent.setEditClickHandler(this.#handleEditClick);
    this.#editTripEventFormComponent.setCloseClickHandler(this.#handleCloseClick);
    this.#editTripEventFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#itemTripEventsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevItemTripEventsComponent === null || prevEditTripEventFormComponent === null) {
      render(this.#listTripEventsContainer, this.#itemTripEventsComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#itemTripEventsComponent, prevItemTripEventsComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editTripEventFormComponent, prevEditTripEventFormComponent);
    }

    remove(prevItemTripEventsComponent);
    remove(prevEditTripEventFormComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditTripEventFormToItemTripEvents();
    }
  }

  destroy = () => {
    remove(this.#itemTripEventsComponent);
    remove(this.#editTripEventFormComponent);
  }

  #replaceItemTripEventsToEditTripEventForm = () => {
    replace(this.#editTripEventFormComponent, this.#itemTripEventsComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceEditTripEventFormToItemTripEvents = () => {
    replace(this.#itemTripEventsComponent, this.#editTripEventFormComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditTripEventFormToItemTripEvents();
    }
  }

  #handleEditClick = () => {
    this.#replaceItemTripEventsToEditTripEventForm();
  }

  #handleCloseClick = () => {
    this.#replaceEditTripEventFormToItemTripEvents();
  }

  #handleFormSubmit = () => {
    this.#replaceEditTripEventFormToItemTripEvents();
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#tripEventsComponent, isFavorite: !this.#tripEventsComponent.isFavorite});
  }
}
