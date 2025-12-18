function calculateSalary() {
  var basic = parseFloat(document.getElementById("basic").value);
  var HRAPercent = parseFloat(document.getElementById("HRA").value);
  var daPercent = parseFloat(document.getElementById("da").value);
  var taxPercent = parseFloat(document.getElementById("tax").value);
  var deduction = parseFloat(document.getElementById("deduction").value);

  if (isNaN(basic) || basic <= 0) {
    document.getElementById("result").innerText = "⚠ Please enter a valid Basic Salary.";
    return;
  }

  HRAPercent = isNaN(HRAPercent) ? 0 : HRAPercent;
  daPercent = isNaN(daPercent) ? 0 : daPercent;
  taxPercent = isNaN(taxPercent) ? 0 : taxPercent;
  deduction = isNaN(deduction) ? 0 : deduction;

  var HRA = (HRAPercent / 100) * basic;
  var da = (daPercent / 100) * basic;
  var tax = (taxPercent / 100) * basic;

  var grossSalary = basic + HRA + da;
  var netSalary = grossSalary - tax - deduction;

  document.getElementById("result").innerText =
    `💰 Gross Salary: ₹${grossSalary.toFixed(2)}\n🧾 Net Salary: ₹${netSalary.toFixed(2)}`;
}
