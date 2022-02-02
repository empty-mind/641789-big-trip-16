import {isEscKey} from '../utils/common.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {RenderPosition, render, remove} from '../utils/render';
import EditTripEventFormView from '../view/edit-trip-event-form-view.js';

export default class NewTripEventPresenter {
  #listTripEventsContainer = null;
  #changeData = null;
  #editTripEventFormComponent = null;
  #destroyCallback = null;
  #tripEventsModel = null;

  constructor(tripEventsModel, listTripEventsContainer, changeData) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#changeData = changeData;
    this.#tripEventsModel = tripEventsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editTripEventFormComponent !== null) {
      return;
    }

    this.#editTripEventFormComponent = new EditTripEventFormView(this.#tripEventsModel.destinations, this.#tripEventsModel.offers);
    this.#editTripEventFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editTripEventFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#listTripEventsContainer, this.#editTripEventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.onEscKeyDown);
  }

  destroy = () => {
    if (this.#editTripEventFormComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editTripEventFormComponent);
    this.#editTripEventFormComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  setSaving = () => {
    this.#editTripEventFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetForm = () => {
      this.#editTripEventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editTripEventFormComponent.shake(resetForm);
  }

  #onEscKeyDown = (evt) => {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  #handleFormSubmit = (tripEvent) => {
    this.#changeData(UserAction.ADD_TRIP_EVENT, UpdateType.MINOR, tripEvent);
    this.destroy();
  }

  #handleDeleteClick = () => {
    this.destroy();
  }
}
