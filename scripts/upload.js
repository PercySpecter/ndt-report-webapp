const getYearOptions = (startYear, endYear) => {
  let list = "";
  for (let currYear = startYear; currYear <= endYear; currYear++) {
    let nextYear = (currYear + 1) % 100;
    let suffix = "" + nextYear;
    if (Math.floor(nextYear / 10) == 0) {
      suffix = "0" + suffix;
    }
    let currFinancialYear = currYear + "-" + suffix;
    let currOption = `<option value="${currYear}">${currFinancialYear}</options>`;
    list += currOption + "\n";
  }
  return list;
};

const getUnitOptions = (station) => {
  let numberOfUnits = 0;
  if (station == 'sgs') {
    numberOfUnits = 2;
  } else if (station == 'bbgs') {
    numberOfUnits = 3;
  } else {
    numberOfUnits = 0;
  }

  let list = "";
  for (let currUnit = 1; currUnit <= numberOfUnits; currUnit++) {
    let currOption = `<option value="${currUnit}">#${currUnit}</options>`;
    list += currOption + "\n";
  }
  console.log(list);
  return list;
};

const initializeForm = () => {
  const startYear = env.start_year;
  const endYear = new Date().getFullYear();
  document.getElementById('year').innerHTML = getYearOptions(startYear, endYear);

  document.getElementById('station').addEventListener('change', (e) => {
    const station = document.getElementById('station').value;
    document.getElementById('unit').innerHTML = getUnitOptions(station);
  });
};

(async () => {
  initializeForm();
  document.getElementById('upload-form').action = env.api_root_url + "/api/upload-pdf";
  document.getElementById('callback').value = env.webapp_root_url + "/upload.html";
})();