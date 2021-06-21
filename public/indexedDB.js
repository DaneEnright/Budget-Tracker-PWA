let db;

const request = window.indexedDB.open("budgetList", 1);

request.onupgadeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("budgetStore", { autoIncrement: true });
};

request.onsuccess = function (event) {
  console.log("success");
  db = event.target.result;

  if (navigator.onLine) {
    console.log("Backend Online");
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Something went wrong!");
};

function saveRecord(record) {
  const transaction = db.transactions(["budgetStore", "readwrite"]);
  const save = transaction.objectStore("budgetStore");
  save.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["budgetStore", "readwrite"]);
  const store = transaction.objectStore("budgetStore");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "appliation/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          const saveInfo = db.transaction("budStore", "readwrite");
          const store = saveInfo.objectStore("budgetStore");
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);
