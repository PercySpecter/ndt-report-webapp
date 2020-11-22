const openUploadWindow = () => {
  const parentWindow = window.self;
  let uploadWindow = window.open("upload.html", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,top=300,left=500,width=500,height=500");
  uploadWindow.addEventListener('unload', (e) => {
    console.log("helllllllllooooooooo");
    parentWindow.location.reload();
  })
};

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

  document.getElementById('reset-button').addEventListener('click', (e) => {
    location.reload();
  });
};

const deleteReportFile = async (dir, file) => {
  let report = dir.split('_');
  let msg = `Delete NDT Report ${file} for ${report[0].toUpperCase()}#${report[1]} ${env.category[report[3]]} for the financial year ${toFinancialYear(report[2])}?`;
  if (confirm(msg)) {
    try {
      let queryResult = await fetch(`${env.api_root_url}/api/delete-report/${dir}/${file}`, {
        method: 'DELETE',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      result = await queryResult.json();
      status = await queryResult.status;
      console.log(result);
  
    } catch (e) {
      console.log(e);
    }
  }
};

const displayResult = (reports) => {
  let resTable = "";
  reports.forEach(report => {
    let row = "";

    let currReportItems = "";
    report[1].forEach(file => {
      currReportItems += `
        <li>
          ${file} &nbsp
          <a href="${env.api_root_url + "/api/view-report/" + report[0] + "/" + file}" target="_blank">View</a> &nbsp
          <a onclick="deleteReportFile('${report[0]}', '${file}');" href="">Delete</a>
        </li>
      `;
    });

    let currReport = report[0].split("_");
    row += `
      <tr class="row100 body">
        <td class="cell100 column1">${currReport[0].toUpperCase()}</td>
        <td class="cell100 column2">${currReport[1]}</td>
        <td class="cell100 column3">${toFinancialYear(currReport[2])}</td>
        <td class="cell100 column4">${env.category[currReport[3]]}</td>
        <td class="cell100 column5">
          <ul>
            ${currReportItems}
          </ul>
        </td>
      </tr>
    `;

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