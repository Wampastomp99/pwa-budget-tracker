// register our service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").then((reg) => {
        console.log("Service worker registered.", reg);
      });
    });
  }
  
  let transactions = [];
  let myChart;
  const transactionForm = createTransactionForm();
  const transactionApi = createTransactionApi();
  
  initTransactions();
  
  document.querySelector("#add-btn").onclick = function () {
    sendTransaction(true);
  };
  
  document.querySelector("#sub-btn").onclick = function () {
    sendTransaction(false);
  };
  
  function createTransactionForm() {
    const nameEl = document.querySelector("#t-name");
    const amountEl = document.querySelector("#t-amount");
    const errorEl = document.querySelector(".form .error");
  
    const showError = (message) => {
      errorEl.textContent = message;
    };
  
    // return false if invalid and display validation message
    const validate = () => {
      // validate form
      if (nameEl.value === "" || amountEl.value === "") {
        showError("Missing Information");
        return false;
      }
      showError("");
      return true;
    };
  
    // return transaction object from form input
    const transaction = () => {
      return {
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString()
      };
    };
  
    // clear form inputs
    const clear = () => {
      nameEl.value = "";
      amountEl.value = "";
      showError("");
    };
  
    return Object.freeze({ transaction, validate, clear, showError });
  }
  
  function createTransactionApi() {
    const create = (transaction) => {
      return fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      }).then((response) => {
        return response.json();
      });
    };