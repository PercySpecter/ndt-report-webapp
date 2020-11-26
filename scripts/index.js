const displayLoadingGif = () => {
  // document.getElementById('loading').style.display = "inline";
  document.getElementById("search-prompt").style.display = "none";
  document.getElementById('result').innerHTML = `<img id="loading" class="loading" src="images/loading.gif" alt="Searching Report..."></img>`;
};

const openUploadWindow = () => {
  document.getElementById("search-prompt").style.display = "inline";
  const parentWindow = window.self;
  const posVertical = Math.floor(window.innerHeight / 4);
  const posHorizontal = Math.floor(window.innerWidth / 4);
  const width = 2 * posHorizontal;
  const height = 2 * posVertical;
  let uploadWindow = window.open("upload.html", "_blank", 
          `toolbar=no,scrollbars=yes,resizable=yes,top=${posVertical},left=${posHorizontal},width=${width},height=${height}`);
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
    location.replace(env.webapp_root_url + "/index.html");
  });
};

const deleteReportFile = async (dir, file) => {
  document.getElementById('result').innerHTML = `<img id="loading" class="loading" src="images/loading.gif" alt="Searching Report..."></img>`;
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

      if (result.status == 0) {
        document.getElementById('query-button').click();
      }
  
    } catch (e) {
      console.log(e);
    }
  } else {
    document.getElementById('query-button').click();
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
          <span class="file-info">
            ${[file[0]]}
            <span class="file-info-text">Created On: ${file[1]}</span>
          </span> &nbsp
          <a href="${env.api_root_url + "/api/view-report/" + report[0] + "/" + file[0]}" target="_blank">View</a> &nbsp
          <a href="${env.api_root_url + "/api/download-report/" + report[0] + "/" + file[0]}" target="_blank">Download</a> &nbsp
          <a onclick="deleteReportFile('${report[0]}', '${file[0]}');" href="#">Delete</a>
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
    resTable += `<td colspan="4" style="color: red; padding-left: 24px;">No Reports Available for the selected criteria<td>`
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
