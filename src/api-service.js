const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get tripEvents() {
    return this.#load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this.#load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (tripEvent) => {
    const response = await this.#load({
      url:  `points/${tripEvent.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addTripEvent = async (tripEvent) => {
    const response = await this.#load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteTripEvent = async (tripEvent) => await this.#load({
    url: `points/${tripEvent.id}`,
    method: Method.DELETE,
  })

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (tripEvent) => {
    const adaptedTripEvent = {...tripEvent,
      'base_price': Number(tripEvent.basePrice),
      'date_from': tripEvent.dateFrom instanceof Date ? tripEvent.dateFrom.toISOString() : null,
      'date_to': tripEvent.dateTo instanceof Date ? tripEvent.dateTo.toISOString() : null,
      'is_favorite': tripEvent.isFavorite,
    }

    delete adaptedTripEvent.price;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.dateTo;
    delete adaptedTripEvent.isFavorite;

    return adaptedTripEvent;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
