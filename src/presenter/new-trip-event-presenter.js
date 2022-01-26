import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../utils/const.js';
import {RenderPosition, render, remove} from '../utils/render';
import EditTripEventFormView from '../view/edit-trip-event-form-view.js';

export default class NewTripEventPresenter {
  #listTripEventsContainer = null;
  #changeData = null;
  #editTripEventFormComponent = null;

  constructor(listTripEventsContainer, changeData) {
    this.#listTripEventsContainer = listTripEventsContainer;
    this.#changeData = changeData;
  }

  init = () => {
    if (this.#editTripEventFormComponent !== null) {
      return;
    }

    this.#editTripEventFormComponent = new EditTripEventFormView();
    this.#editTripEventFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editTripEventFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#listTripEventsContainer, this.#editTripEventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.onEscKeyDown);
  }

    destroy = () => {
      if (this.#editTripEventFormComponent === null) {
        return;
      }

      remove(this.#editTripEventFormComponent);
      this.#editTripEventFormComponent = null;

      document.removeEventListener('keydown', this.#onEscKeyDown);
    }

    #handleFormSubmit = (tripEvent) => {
      this.#changeData(UserAction.ADD_TRIP_EVENT, UpdateType.MINOR, {id: nanoid(), ...tripEvent});
      this.destroy();
    }

    #handleDeleteClick = () => {
      this.destroy();
    }

    #onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.destroy();
      }
    }
  }
