// mock data
// !ATTENTION - MAGIC NUMBERS AND DRY!

import dayjs from 'dayjs';
import {TRIP_EVENT_COUNT} from './const.js';
import {getRandomInteger} from './get-random-integer.js';

const generateDate = () => {
  const maxMinuteGap = 5 * 24 * 60; // 5 days
  const minuteGap = getRandomInteger(-maxMinuteGap, maxMinuteGap);

  return dayjs().add(minuteGap, 'm');
};

const generateDateFrom = () => generateDate();

const generateDateTo = (date) => {
  const maxMinuteGap = 5 * 24 * 60; // 5 days
  const minuteGap = getRandomInteger(1, maxMinuteGap);

  return dayjs(date).add(minuteGap, 'm');
};

const generateDescription = () => {
  const descriptions = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. \
Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, \
sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. \
Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. \
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. \
Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. '.split('. ');

  return descriptions[getRandomInteger(0, descriptions.length - 1)];
};

const generateDescriptions = () => {
  let result = generateDescription();

  for (let index = 1; index <= getRandomInteger(1, 5); index++) {
    result += `${generateDescription()}. `;
  }

  return result;
};

const generateDestinationCity = () => {
  const destinations = [
    'Amsterdam',
    'Chamonix',
    'Geneva',
  ];

  return destinations[getRandomInteger(0, destinations.length - 1)];
};

const generatePictures = () => {
  const result = [];

  for (let index = 1; index <= 5; index++) {
    result.push(
      {
        src: `http://picsum.photos/300/200?r=${Math.random()}`,
        description: generateDescription(),
      },
    );
  }

  return result;
};

const generateOffers = () => { // добавил иконку в структуру
  const offers = [
    {
      type: 'taxi',
      offers: [
        {
          'id': 1,
          'title': 'Upgrade to a business class',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 2,
          'title': 'Choose the radio station',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 3,
          'title': 'Order Uber',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/taxi.png',
    },
    {
      type: 'bus',
      offers: [
        {
          'id': 1,
          'title': 'Add luggage',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 2,
          'title': 'Switch to comfort',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 3,
          'title': 'Book tickets',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/bus.png',
    },
    {
      type: 'train',
      offers: [
        {
          'id': 1,
          'title': 'Upgrade to a business class',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 2,
          'title': 'Add luggage',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 3,
          'title': 'Switch to comfort',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 4,
          'title': 'Book tickets',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/train.png',
    },
    {
      type: 'ship',
      offers: [
        {
          'id': 1,
          'title': 'Upgrade to a business class',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 2,
          'title': 'Add luggage',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 3,
          'title': 'Switch to comfort',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 4,
          'title': 'Book tickets',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/ship.png',
    },
    {
      type: 'drive',
      offers: [
        {
          'id': 1,
          'title': 'Rent a car',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/drive.png',
    },
    {
      type: 'flight',
      offers: [
        {
          'id': 1,
          'title': 'Upgrade to a business class',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 2,
          'title': 'Add luggage',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 3,
          'title': 'Switch to comfort',
          'price': getRandomInteger(0, 200),
        },
        {
          'id': 4,
          'title': 'Book tickets',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/flight.png',
    },
    {
      type: 'check-in',
      offers: [
        {
          'id': 1,
          'title': 'Add breakfast',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/check-in.png',
    },
    {
      type: 'sightseeing',
      offers: [
        {
          'id': 1,
          'title': 'Add breakfast',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/sightseeing.png',
    },
    {
      type: 'restaurant',
      offers: [
        {
          'id': 1,
          'title': 'Add breakfast',
          'price': getRandomInteger(0, 200),
        },
      ],
      iconSrc: 'img/icons/restaurant.png',
    }
  ];

  return offers[getRandomInteger(0, offers.length - 1)];
};

const generateTripEvent = (index, offers) => {
  const dateFrom = generateDateFrom();
  const dateTo = generateDateTo(dateFrom);

  return {
    basePrice: getRandomInteger(1, 20) * 10,
    dateFrom,
    dateTo,
    destination: {
      description: generateDescriptions(),
      name: generateDestinationCity(),
      pictures: generatePictures(),
    },
    id: index,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: offers,
    type: offers.type, // тип точки маршрута совпадает с типом дополнительной опции
    icon: offers.iconSrc, // добавил иконку в структуру
  };
};

const generateTripEvents = () => {
  const result = [];

  for (let index = 1; index <= TRIP_EVENT_COUNT; index++) {
    result.push(generateTripEvent(index, generateOffers()));
  }

  return result;
};

export const tripEventsDataMockArray = generateTripEvents().slice();
