import SmartView from './smart-view';
import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderMoneyChart = (moneyCtx, tripEvents) => {
  const tripEventsTypes = Array.from(new Set(tripEvents.map((tripEvent) => tripEvent.type)));

  const countTripEventsMoney = (tripEvents, type) => {
    const filterTripEvents = tripEvents.filter((tripEvent) => tripEvent.type === type);
    return {
      money: filterTripEvents.reduce((money, tripEvent) => +money + tripEvent.basePrice, 0),
      type: type,
    };
  };

  const countMoney = tripEventsTypes.map((type) => countTripEventsMoney(tripEvents, type));
  const sortMoney = countMoney.sort(({money: moneyA}, {money: moneyB}) => moneyB - moneyA);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortMoney.map(({type}) => type.toUpperCase()),
      datasets: [{
        data: sortMoney.map(({money}) => money),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

const renderTypeChart = (typeCtx, tripEvents) => {
  const tripEventsTypes = Array.from(new Set(tripEvents.map((tripEvent) => tripEvent.type)));

  const countTripEventsTypes = (tripEvents, type) => {
    const filterTripEvents = tripEvents.filter((tripEvent) => tripEvent.type === type);
    return {
      typeCount: filterTripEvents.length,
      type: type,
    };
  };

  const countTypes = tripEventsTypes.map((type) => countTripEventsTypes(tripEvents, type));
  const sortTypes = countTypes.sort(({typeCount: typeCountA}, {typeCount: typeCountB}) => typeCountB - typeCountA);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortTypes.map(({type}) => type.toUpperCase()),
      datasets: [{
        data: sortTypes.map(({typeCount}) => typeCount),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

const renderTimeChart = (timeCtx, tripEvents) => {
  const tripEventsTypes = Array.from(new Set(tripEvents.map((tripEvent) => tripEvent.type)));

  const formatTime = (time) => {
    const day = Math.floor(time/1440) > 0 ? `${Math.floor(time/1440)}D` : '';
    const hours = Math.floor(time/60) % 24 > 0 ? `${Math.floor(time/60) % 24}H` : '';
    const minutes = (time % 60) > 0 ? `${time % 60}M` : '00M';

    return `${day} ${hours} ${minutes}`;
  }

  const countTripEventsTime = (tripEvents, type) => {
    const filterTripEvents = tripEvents.filter((tripEvent) => tripEvent.type === type);
    const durationTime = filterTripEvents.reduce((time, tripEvent) => time + dayjs(tripEvent.dateTo).diff(tripEvent.dateFrom, 'minute'), 0);

    return {
      time: durationTime,
      type: type,
    };
  };

  const counttime = tripEventsTypes.map((type) => countTripEventsTime(tripEvents, type));
  const sortTime = counttime.sort(({time: timeA}, {time: timeB}) => timeB - timeA);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortTime.map(({type}) => type.toUpperCase()),
      datasets: [{
        data: sortTime.map(({time}) => time),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${formatTime(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

export const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);


export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(tripEvents) {
    super();

    this._data = {
      tripEvents,
    };

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#moneyChart) {
      this.#moneyChart.destroy();
      this.#moneyChart = null;
    }

    if (this.#typeChart) {
      this.#typeChart.destroy();
      this.#typeChart = null;
    }

    if (this.#timeChart) {
      this.#timeChart.destroy();
      this.#timeChart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    const {tripEvents} = this._data;

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;

    this.#moneyChart = renderMoneyChart(moneyCtx, tripEvents);
    this.#typeChart = renderTypeChart(typeCtx, tripEvents);
    this.#timeChart = renderTimeChart(timeCtx, tripEvents);
  }
}
