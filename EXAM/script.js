let recipes = [
    { title: "FRUIT", desc: "Fruit Salad", img: "img/f.jpg" },
    { title: "BAGUETTE", desc: "Italian Bread", img: "img/b.jpg" },
    { title: "PASTA", desc: "With Salad", img: "img/p.jpg" },
];

let selectedIndex = 0;

// Elements
const list = document.getElementById("recipeList");
const viewImg = document.getElementById("viewImg");
const viewTitle = document.getElementById("viewTitle");
const viewDesc = document.getElementById("viewDesc");

const modal = document.getElementById("modal");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const imgInput = document.getElementById("img");
const modalTitle = document.getElementById("modalTitle");

// 👉 Render List
function render() {
    list.innerHTML = "";

    recipes.forEach((r, i) => {
        const li = document.createElement("li");

        // Active class
        if (i === selectedIndex) {
            li.classList.add("active");
        }

        li.innerHTML = `
            <div>
                <b>${r.title}</b><br>
                <small>${r.desc}</small>
            </div>
            <img src="${r.img || 'img/p.jpg'}">
        `;

        li.onclick = () => selectRecipe(i);

        list.appendChild(li);
    });
}

// 👉 Select Recipe
function selectRecipe(i) {
    selectedIndex = i;

    const recipe = recipes[i];
    viewImg.src = recipe.img || "img/p.jpg";
    viewTitle.innerText = recipe.title;
    viewDesc.innerText = recipe.desc;

    render();
}

// 👉 Add Recipe
document.getElementById("addBtn").onclick = () => {
    modalTitle.innerText = "Add Recipe";

    titleInput.value = "";
    descInput.value = "";
    imgInput.value = "";

    modal.style.display = "flex";
};

// 👉 Edit Recipe
document.getElementById("editBtn").onclick = () => {
    const recipe = recipes[selectedIndex];

    modalTitle.innerText = "Edit Recipe";

    titleInput.value = recipe.title;
    descInput.value = recipe.desc;
    imgInput.value = recipe.img;

    modal.style.display = "flex";
};

// 👉 Save
document.getElementById("saveBtn").onclick = () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const img = imgInput.value.trim() || "img/p.jpg";

    if (!title || !desc) {
        alert("Please fill all fields");
        return;
    }

    if (modalTitle.innerText === "Add Recipe") {
        recipes.push({ title, desc, img });
        selectedIndex = recipes.length - 1;
    } else {
        recipes[selectedIndex] = { title, desc, img };
    }

    closeModal();
    render();
    selectRecipe(selectedIndex);
};

// 👉 Close Modal
function closeModal() {
    modal.style.display = "none";
}

// 👉 Initial Load
render();
selectRecipe(selectedIndex);
