const valueInput = document.getElementById("usd-value");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

//function to find sort selected exchange rates
function exchangeFilter(startDate, endDate) {
  let selectedRates = exchangeRates.filter(function (item) {
    var itemDate = new Date(item.date);
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return itemDate >= startDate && itemDate <= endDate;
  });
  selectedRates = selectedRates.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  selectedRates = selectedRates.reverse();
  return selectedRates;
}

//function to convert value for selected rates
function convertValue(inputVal, arr, targetEl) {
  //
  let fieldsStr = "";
  for (var i = 0, len = arr.length; i < len; i++) {
    let converted = (inputVal / arr[i].rate).toFixed(2);
    let exchangeMonth = new Date(arr[i].date);
    let exchangeRate = arr[i].rate;
    exchangeMonth = months[exchangeMonth.getMonth()];

    let genField = `
				<div class="field is-horizontal">
  <div class="field-label">
    <label class="label"><span class="js-month">${exchangeMonth}</span>
    	<span class="js-rate">${exchangeRate}</span>
    </label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="0" value="${converted}" disabled>
    <span class="icon is-small is-left">
      <i class="fas fa-euro-sign"></i>
    </span>
  </div>
    </div>
  </div>
</div>
		`;
    fieldsStr = fieldsStr + genField;
  }
  let element = document.getElementById(targetEl);
  element.innerHTML = fieldsStr;
}

//create rate arrays per year
const rates2018 = exchangeFilter("2018-01-01", "2018-12-31");
const rates2017 = exchangeFilter("2017-01-01", "2017-12-31");
const rates2016 = exchangeFilter("2016-01-01", "2016-12-31");

//on ready load fields with 0
document.addEventListener("DOMContentLoaded", event => {
  convertValue(0, rates2018, "js-2018");
  convertValue(0, rates2017, "js-2017");
  convertValue(0, rates2016, "js-2016");
});

//listen for input change
valueInput.addEventListener("keyup", event => {
  let enteredValue = valueInput.value;
  if (isNaN(enteredValue)) {
    console.log("Not a num");
  } else {
    convertValue(enteredValue, rates2018, "js-2018");
    convertValue(enteredValue, rates2017, "js-2017");
    convertValue(enteredValue, rates2016, "js-2016");
  }
});

