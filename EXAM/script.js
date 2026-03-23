let recipes = [
    { title: "FRUIT", desc: "Fruit Salad", img: "img/f.jpg" },
    { title: "BAGUETTE", desc: "Italian Bread", img: "img/b.jpg" },
    { title: "PASTA", desc: "With Salad", img: "img/p.jpg" },
];

let selectedIndex = 0;

const list = document.getElementById("recipeList");
const viewImg = document.getElementById("viewImg");
const viewTitle = document.getElementById("viewTitle");
const viewDesc = document.getElementById("viewDesc");

function render() {
    list.innerHTML = "";
    recipes.forEach((r, i) => {
        list.innerHTML += `
      <li onclick="selectRecipe(${i})">
        <div>
          <b>${r.title}</b><br>
          <small>${r.desc}</small>
        </div>
        <img src="${r.img}">
      </li>
    `;
    });
}

function selectRecipe(i) {
    selectedIndex = i;
    viewImg.src = recipes[i].img;
    viewTitle.innerText = recipes[i].title;
    viewDesc.innerText = recipes[i].desc;
    render();
}

render();

const modal = document.getElementById("modal");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const imgInput = document.getElementById("img");
const modalTitle = document.getElementById("modalTitle");

document.getElementById("addBtn").onclick = () => {
    modalTitle.innerText = "Add Recipe";
    
    titleInput.value = "";
    descInput.value = "";
    imgInput.value = "";
    modal.style.display = "block";
};

document.getElementById("editBtn").onclick = () => {
    modalTitle.innerText = "Edit Recipe";
    titleInput.value = recipes[selectedIndex].title;
    descInput.value = recipes[selectedIndex].desc;
    imgInput.value = recipes[selectedIndex].img;
    modal.style.display = "block";

};

document.getElementById("saveBtn").onclick = () => {
    if (modalTitle.innerText === "Add Recipe") {
        recipes.push({
            title: titleInput.value,
            desc: descInput.value,
            img: imgInput.value
        });
    } else {
        recipes[selectedIndex] = {
            title: titleInput.value,
            desc: descInput.value,
            img: imgInput.value
        };
    }
    closeModal();
    render();
    selectRecipe(selectedIndex);
};

function closeModal() {
    modal.style.display = "none";
}
