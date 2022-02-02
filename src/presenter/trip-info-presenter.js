import {render, remove, RenderPosition} from '../utils/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #tripEventsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, tripEventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripEventsModel = tripEventsModel;
  }

  init = () => {
    this.#tripInfoComponent = new TripInfoView(this.#tripEventsModel.tripEvents);
    render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  destroy = () => {
    remove(this.#tripInfoComponent);
  }
}
