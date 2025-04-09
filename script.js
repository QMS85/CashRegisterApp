let price = 0;
let cid = [
    ["PENNY", 0.01],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0]
];

const purchaseBtn = document.getElementById('purchase-btn');
const cashInput = document.getElementById('cash');
const changeDueDiv = document.getElementById('change-due');

purchaseBtn.addEventListener('click', function () {
    const cash = parseFloat(cashInput.value);
    const change = cash - price;

    if (change < 0) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (change === 0) {
        changeDueDiv.textContent = "No change due - customer paid with exact cash";
        return;
    }

    const changeDue = getChangeDue(change);

    if (changeDue.status === "INSUFFICIENT_FUNDS") {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (changeDue.status === "CLOSED") {
        changeDueDiv.textContent = `Status: CLOSED ${changeDue.change.map(item => `${item[0]}: $${item[1].toFixed(2)}`).join(' ')}`;
    } else {
        changeDueDiv.textContent = `Status: OPEN ${changeDue.change.map(item => `${item[0]}: $${item[1].toFixed(2)}`).join(' ')}`;
    }
});

function getChangeDue(change) {
    const currencyValues = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.1,
        "QUARTER": 0.25,
        "ONE": 1,
        "FIVE": 5,
        "TEN": 10,
        "TWENTY": 20,
        "ONE HUNDRED": 100
    };

    let changeDue = [];
    let remainingChange = change;
    let totalCid = 0;

    // Calculate total cash in drawer
    cid.forEach(currency => totalCid += currency[1]);
    totalCid = parseFloat(totalCid.toFixed(2));

    if (totalCid < change) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    for (let i = cid.length - 1; i >= 0; i--) {
        const currency = cid[i][0];
        const currencyValue = currencyValues[currency];
        const currencyAmount = cid[i][1];

        if (currencyValue > remainingChange || currencyAmount === 0) {
            continue;
        }

        const amount = Math.floor(remainingChange / currencyValue);
        const usedAmount = Math.min(amount, currencyAmount / currencyValue);

        if (usedAmount > 0) {
            const changeForCurrency = parseFloat((usedAmount * currencyValue).toFixed(2));
            remainingChange -= changeForCurrency;
            remainingChange = parseFloat(remainingChange.toFixed(2)); // Avoid floating-point issues
            changeDue.push([currency, changeForCurrency]);
            cid[i][1] -= changeForCurrency;
        }

        if (remainingChange === 0) {
            break;
        }
    }

    if (remainingChange > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    if (totalCid === change) {
        return { status: "CLOSED", change: changeDue };
    }

    return { status: "OPEN", change: changeDue };
}
