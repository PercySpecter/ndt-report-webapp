const toFinancialYear = (currYear) => {
  currYear = +currYear;
  let nextYear = (currYear + 1) % 100;
  let suffix = "" + nextYear;
  if (Math.floor(nextYear / 10) == 0) {
    suffix = "0" + suffix;
  }
  return currYear + "-" + suffix;
};

const getYearOptions = (startYear, endYear) => {
  let list = "<option value='-1' selected>Year...</option> \n";
  for (let currYear = startYear; currYear <= endYear; currYear++) {
    let currFinancialYear = toFinancialYear(currYear);
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

  let list = "<option value='-1' selected>Unit...</option> \n";
  for (let currUnit = 1; currUnit <= numberOfUnits; currUnit++) {
    let currOption = `<option value="${currUnit}">${currUnit}</options>`;
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

    document.getElementById('query-button').click();
  });

  document.getElementById('unit').addEventListener('change', (e) => {
    document.getElementById('query-button').click();
  });

  document.getElementById('year').addEventListener('change', (e) => {
    document.getElementById('query-button').click();
  });

  document.getElementById('category').addEventListener('change', (e) => {
    document.getElementById('query-button').click();
  });
};

const displayResult = (reports) => {
  const CATEGORY = ["Survey", "Breakdown", "Preventive Maintenance"];
  let resTable = `
    <tr>
      <th>Station</th>
      <th>Unit #</th>
      <th>Financial Year</th>
      <th>Category</th>
      <th> Action </th>
    </tr>
  `;
  reports.forEach(report => {
    let row = "";

    let currReport = report.split("_");
    currReport[3] = "" + currReport[3].charAt(0);
    row += `
      <tr>
        <td>${currReport[0].toUpperCase()}</td>
        <td>${currReport[1]}</td>
        <td>${toFinancialYear(currReport[2])}</td>
        <td>${CATEGORY[currReport[3]]}</td>
        <td><a href="${env.api_root_url + "/api/view-report/" + report}" target="_blank">View Report</a></td>
      </tr>
    `;

    row = "<tr>" + row + "</tr>";
    resTable += row;
  });

  if (reports.length == 0) {
    resTable += `<td colspan="4" style="color: red;">No Reports Available for the selected criteria<td>`
  }

  document.getElementById('result').innerHTML = resTable;
};

(async () => {
  initializeForm();

  document.getElementById('query-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      let queryResult = await fetch(`${env.api_root_url}/api/query-report`, {
        method: 'POST',
        body: JSON.stringify({
          station: document.getElementById('station').value,
          unit: document.getElementById('unit').value,
          year: document.getElementById('year').value,
          category: document.getElementById('category').value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      reports = await queryResult.json();
      status = await queryResult.status;
      console.log(reports);

      displayResult(reports);

    } catch (e) {
      console.log(e);
    }
  });

  document.getElementById('query-button').click();
})();