function calculateTip() {
  var bill = parseFloat(document.getElementById("billAmount").value);
  var tipPercent = parseFloat(document.getElementById("tipPercent").value);
  var people = parseInt(document.getElementById("peopleCount").value);

  if (isNaN(bill) || bill <= 0) {
    document.getElementById("result").innerHTML = "⚠ Please enter a valid bill amount.";
    return;
  }
  if (isNaN(tipPercent) || tipPercent < 0) {
    document.getElementById("result").innerHTML = "⚠ Please enter a valid tip percentage.";
    return;
  }
  if (isNaN(people) || people <= 0) {
    document.getElementById("result").innerHTML = "⚠ Number of people must be at least 1.";
    return;
  }

  var tipAmount = bill * (tipPercent / 100);
  var tipPerPerson = tipAmount / people;
  var totalAmount = bill + tipAmount;
  var totalPerPerson = totalAmount / people;

  document.getElementById("result").innerHTML 
    `<b>Tip per Person:</b> $${tipPerPerson.toFixed(2)}<br>` +
    `<b>Total per Person:</b> $${totalPerPerson.toFixed(2)}<br>` +
    `<b>Total Bill:</b> $${totalAmount.toFixed(2)}`;
}

function resetCalculator() {
  document.getElementById("billAmount").value = "";
  document.getElementById("tipPercent").value = "";
  document.getElementById("peopleCount").value = "";
  document.getElementById("result").innerHTML = "";
}
