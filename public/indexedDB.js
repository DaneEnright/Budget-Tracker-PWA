let db;

const request = window.indexedDB.open("budgetList", 1);

request.onupgradeneeded = function ({ target }) {
  let db = target.result;
  db.createObjectStore("budgetStore", { autoIncrement: true });
};

request.onsuccess = function ({ target }) {
  console.log("success");
  db = target.result;

  if (navigator.onLine) {
    console.log("Backend Online");
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Something went wrong!" + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const save = transaction.objectStore("budgetStore");
  save.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const save = transaction.objectStore("budgetStore");
  const getAll = save.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          const saveInfo = db.transaction("budgetStore", "readwrite");
          const store = saveInfo.objectStore("budgetStore");
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);
