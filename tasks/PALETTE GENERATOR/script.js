function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generatePalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const color = generateRandomColor();
    const card = document.createElement("div");
    card.className = "color-card";
    card.style.background = color;
    palette.appendChild(card);
  }
}

generatePalette();
