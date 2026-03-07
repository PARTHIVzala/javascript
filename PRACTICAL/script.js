function calculate() {
    let table = document.getElementById("invoiceTable");
    let rows = table.rows;
    let subtotal = 0;

    for (let i = 1; i < rows.length; i++) {
        let qty = rows[i].querySelector(".qty").value;
        let rate = rows[i].querySelector(".rate").value;
        let amountField = rows[i].querySelector(".amount");

        if (qty > 0 && rate > 0) {
            let amount = qty * rate;
            amountField.value = amount;
            subtotal += amount;
        } else {
            amountField.value = 0;
        }
    }

    document.getElementById("subtotal").innerText = subtotal;

    let discount = document.getElementById("discount").value || 0;

    if (discount > subtotal) {
        alert("Discount cannot exceed subtotal");
        document.getElementById("discount").value = 0;
        discount = 0;
    }

    let taxable = subtotal - discount;
    let gst = taxable * 0.18;
    let grandTotal = taxable + gst;

    document.getElementById("gst").innerText = gst.toFixed(2);
    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

function addRow() {
    let table = document.getElementById("invoiceTable");
    let row = table.insertRow();

    row.innerHTML = `
        <td><input type="text" class="item"></td>
        <td><input type="number" class="qty" oninput="calculate()"></td>
        <td><input type="number" class="rate" oninput="calculate()"></td>
        <td><input type="number" class="amount" readonly></td>
    `;
}

function resetForm() {
    location.reload();
}