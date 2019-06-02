const valueInput = document.getElementById('usd-value');

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const exchangeDates = exchangeRates.map(x => x.date.substring(0, 4));
const exchangeYears = [...new Set(exchangeDates)];

exchangeYears.forEach(el => {
  const start = el + '-01-01';
  const end = el + '-12-31';
  const elID = 'js-' + el;
  const rates = exchangeFilter(start, end);
  convertValue(0, rates, elID);
});

valueInput.addEventListener('keyup', event => {
  let enteredValue = valueInput.value;
  if (isNaN(enteredValue)) {
    console.log('Not a number');
  } else {
    calculateRates(exchangeRates, enteredValue);
  }
});

function exchangeFilter(startDate, endDate) {
  let selectedRates = exchangeRates.filter(function(item) {
    const itemDate = new Date(item.date);
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return itemDate >= startDate && itemDate <= endDate;
  });

  selectedRates = selectedRates.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  selectedRates = selectedRates.reverse();

  return selectedRates;
}

function convertValue(inputVal, arr, targetEl) {
  const yearColEl = document.getElementById(targetEl);
  let fieldsStr = '';
  const rates = [];

  for (var i = 0, len = arr.length; i < len; i++) {
    const converted = (inputVal / arr[i].rate).toFixed(2);
    let exchangeMonth = new Date(arr[i].date);
    const exchangeRate = arr[i].rate.toFixed(4);
    rates.push(arr[i].rate);
    const monthDay = exchangeMonth.getMonth() + '-' + exchangeMonth.getDate();
    exchangeMonth = months[exchangeMonth.getMonth()];

    const genField = createRateEl(exchangeMonth, exchangeRate, converted);
    fieldsStr = fieldsStr + genField;

    if (i === arr.length - 1) {
      const rateAvg = rates.reduce((a, b) => a + b, 0) / rates.length;
      const rateAvgFixed4 = Number(rateAvg).toFixed(4);
      const rateAvgCalc = (inputVal / rateAvg).toFixed(2);
      const avgFieldEl = createRateEl(
        'AVG',
        rateAvgFixed4,
        rateAvgCalc,
        'is-average'
      );
      fieldsStr = fieldsStr + avgFieldEl;
    }

    yearColEl.innerHTML = fieldsStr;
  }
}

function createRateEl(label, rate, calc, specialClass) {
  specialClass = specialClass || '';

  const el = `
				<div class="field is-horizontal ${specialClass}">
            <div class="field-label">
              <label class="label"><span class="js-month">${label}</span>
              	<span class="js-rate">${rate}</span>
              </label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control has-icons-left has-icons-right">
              <input class="input" type="text" placeholder="0" value="${calc}" disabled>
              <span class="icon is-small is-left">
                <i class="fas fa-euro-sign"></i>
              </span>
            </div>
              </div>
            </div>
          </div>
		`;

  return el;
}

function calculateRates(data, val) {
  const exchangeCols = document.querySelectorAll('.exchange-rates');

  exchangeCols.forEach(el => {
    const yearEl = el.id;
    const year = yearEl.replace('js-', '');
    const yearRates = data.filter(i => i.date.includes(year));
    convertValue(val, yearRates, yearEl);
  });
}
