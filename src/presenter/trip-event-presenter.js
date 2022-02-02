import {isEscKey} from '../utils/common.js';
import {render, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import ItemTripEventsView from '../view/item-trip-events-view.js';
import EditTripEventFormView from '../view/edit-trip-event-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class TripEventPresenter {
  #listTripEventsContainer = null;
  #changeData = null;
  #changeMode = null;

  #itemTripEventsComponent = null;
  #editTripEventFormComponent = null;

  #tripEventsComponent = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor(offers, destinations, listTripEventsContainer, changeData, changeMode) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = (tripEventsComponent) => {
    this.#tripEventsComponent = tripEventsComponent;

    const prevItemTripEventsComponent = this.#itemTripEventsComponent;
    const prevEditTripEventFormComponent = this.#editTripEventFormComponent;

    this.#itemTripEventsComponent = new ItemTripEventsView(tripEventsComponent);
    this.#editTripEventFormComponent = new EditTripEventFormView(this.#destinations, this.#offers, tripEventsComponent);

    this.#itemTripEventsComponent.setEditClickHandler(this.#handleEditClick);
    this.#itemTripEventsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editTripEventFormComponent.setCloseClickHandler(this.#handleCloseClick);
    this.#editTripEventFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editTripEventFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevItemTripEventsComponent === null || prevEditTripEventFormComponent === null) {
      render(this.#listTripEventsContainer, this.#itemTripEventsComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#itemTripEventsComponent, prevItemTripEventsComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editTripEventFormComponent, prevEditTripEventFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevItemTripEventsComponent);
    remove(prevEditTripEventFormComponent);
  }

  destroy = () => {
    remove(this.#itemTripEventsComponent);
    remove(this.#editTripEventFormComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editTripEventFormComponent.reset(this.#tripEventsComponent);
      this.#replaceEditTripEventFormToItemTripEvents();
    }
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetForm = () => {
      this.#editTripEventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#editTripEventFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#editTripEventFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#itemTripEventsComponent.shake(resetForm);
        this.#editTripEventFormComponent.shake(resetForm);
        break;
    }
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
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.#editTripEventFormComponent.reset(this.#tripEventsComponent);
      this.#replaceEditTripEventFormToItemTripEvents();
    }
  }

  #handleEditClick = () => {
    this.#replaceItemTripEventsToEditTripEventForm();
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TRIP_EVENT,
      UpdateType.MINOR,
      {...this.#tripEventsComponent, isFavorite: !this.#tripEventsComponent.isFavorite}
    );
  }

  #handleFormSubmit = (tripEventsComponent) => {
    this.#changeData(UserAction.UPDATE_TRIP_EVENT, UpdateType.MINOR, tripEventsComponent);
    this.#replaceEditTripEventFormToItemTripEvents();
  }

  #handleCloseClick = () => {
    this.#editTripEventFormComponent.reset(this.#tripEventsComponent);
    this.#replaceEditTripEventFormToItemTripEvents();
  }

  #handleDeleteClick = (tripEventsComponent) => {
    this.#changeData(UserAction.DELETE_TRIP_EVENT, UpdateType.MINOR, tripEventsComponent);
  }
}
