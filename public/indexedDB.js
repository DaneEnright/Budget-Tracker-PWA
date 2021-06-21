let db;

const request = window.indexedDB.open("budgetList", 1);

request.onupgadeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("budgetStore", {autoIncrement: true});
};

request.onsuccess = function (event) {
    console.log("success");
    db = event.target.result;

    if(navigator.onLine) {
        console.log("Backend Online");
        checkDatabase();
    }
}