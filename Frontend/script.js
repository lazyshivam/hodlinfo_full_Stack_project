document.addEventListener("DOMContentLoaded", async () => {
  const cryptoDataDiv = document.getElementById("cryptoData");
  const cryptoSelect = document.getElementById("crypto");
  const checkbox = document.getElementById("darkModeToggle");
  const timer = document.getElementById("timer");


  let allData = [];

  try {
    const response = await fetch("http://localhost:8000/getCryptoData");
    if (response.ok) {
      const cryptoData = await response.json();
      const CryptoDataWithIndexing = Object.values(cryptoData)
                .map((item, index) => ({
                    name: item.name,
                    last: item.last,
                    buy: item.buy,
                    sell: item.sell,
                    volume: item.volume,
                    base_unit: item.base_unit,
                    index: index + 1
                }));
      allData = CryptoDataWithIndexing;

      const table = createCryptoTable(allData);
      cryptoDataDiv.innerHTML = "";
      cryptoDataDiv.appendChild(table);
    } else {
      cryptoDataDiv.textContent = "Error fetching data.";
      console.log(response);
    }
  } catch (error) {
    console.error(error);
    cryptoDataDiv.textContent = "An error occurred.";
  }

  const filterAndDisplayData = () => {
    const crypto = cryptoSelect.value;
    console.log(crypto);
    const filteredCryptoData = allData.filter(
      (item) => item.base_unit === crypto
    );
    const table = createCryptoTable(filteredCryptoData);
    cryptoDataDiv.innerHTML = "";
    cryptoDataDiv.appendChild(table);
  };


  cryptoSelect.addEventListener("change", filterAndDisplayData);
//for timer
let count=60;
setInterval(() => {
    if(count===0){
        count=60;
    }
    timer.innerHTML=count;
    count=count-1;
}, 1000);
//for toogle the dark mode
  checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
  });
  
});



//Displaying the data in table format
const createCryptoTable = (data) => {
  const table = document.createElement("table");
  const headerRow = table.insertRow();
  const headers = ["No.", "Name", "Last", "Buy", "Sell", "Volume", "Base Unit"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  data.forEach((item) => {
    const row = table.insertRow();
    const values = [
      item.index,
      item.name,
      item.last,
      item.buy,
      item.sell,
      item.volume,
      item.base_unit,
    ];

    values.forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });

  return table;
};

// const checkbox = document.getElementById("darkModeToggle");

// checkbox.addEventListener("change", () => {
//   document.body.classList.toggle("dark");
// });
