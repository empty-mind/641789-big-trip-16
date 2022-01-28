import AbstractView from './abstract-view.js';
import {MenuItem} from '../utils/const.js'; //

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
  </nav>`
);

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    const menu = this.element.querySelectorAll('.trip-tabs__btn');
    const activeBtn = evt.target;

    if (activeBtn.classList.contains('trip-tabs__btn--active')) {
      return;
    }

    menu.forEach((item) => item.classList.remove('trip-tabs__btn--active'));
    activeBtn.classList.add('trip-tabs__btn--active');

    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
