function addRow() {
  let row = `
    <tr>
      <td><input value="Item"></td>
      <td><input type="number" value="1" class="qty"></td>
      <td><input type="number" value="0" class="rate"></td>
      <td class="amount">0</td>
      <td><button onclick="deleteRow(this)">X</button></td>
    </tr>
  `;
  document.getElementById("leftBody").innerHTML += row;
}

function deleteRow(btn) {
  btn.parentElement.parentElement.remove();
  calculate();
}

document.addEventListener("input", function(e) {
  if (e.target.classList.contains("qty") || e.target.classList.contains("rate")) {
    let row = e.target.closest("tr");

    let qty = row.querySelector(".qty").value;
    let rate = row.querySelector(".rate").value;

    let amt = qty * rate;
    row.querySelector(".amount").innerText = amt;

    calculate();
  }

  updatePreview();
});

function calculate() {
  let amounts = document.querySelectorAll(".amount");
  let total = 0;

  amounts.forEach(a => total += Number(a.innerText));

  let gst = total * 0.05;
  let net = total + gst;

  document.getElementById("total").innerText = total;
  document.getElementById("gst").innerText = gst.toFixed(2);
  document.getElementById("net").innerText = net.toFixed(2);

  updatePreview();
}

function updatePreview() {
  let rows = document.querySelectorAll("#leftBody tr");
  let html = `<table>
    <tr>
      <th>Particular</th>
      <th>Qty</th>
      <th>Rate</th>
      <th>Amount</th>
    </tr>`;

  rows.forEach(row => {
    let item = row.children[0].querySelector("input").value;
    let qty = row.querySelector(".qty").value;
    let rate = row.querySelector(".rate").value;
    let amt = row.querySelector(".amount").innerText;

    html += `
      <tr>
        <td>${item}</td>
        <td>${qty}</td>
        <td>${rate}</td>
        <td>${amt}</td>
      </tr>
    `;
  });

  html += `</table>
    <p>Total: ${document.getElementById("total").innerText}</p>
    <p>GST: ${document.getElementById("gst").innerText}</p>
    <p><b>Net: ${document.getElementById("net").innerText}</b></p>
  `;

  document.getElementById("previewContent").innerHTML = html;
}

function printInvoice() {
  window.print();
}

calculate();
updatePreview();