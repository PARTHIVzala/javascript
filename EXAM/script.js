const data = {
    Fruit: {
        img: "images/fruits.jpg",
        title: "Fruit Salad",
        desc: "Healthy fruit salad with fresh seasonal fruits."
    },
    Baguette: {
        img: "images/BAGUETTE.jpg",
        title: "Baguette",
        desc: "Classic French baked bread."
    },
    Pasta: {
        img: "images/pasta.jpg",
        title: "Pasta Recipe",
        desc: "Delicious Italian pasta made with vegetables."
    },
    Soup: {
        img: "images/soup.jpg",
        title: "Hot Soup",
        desc: "Warm and healthy vegetable soup."
    }

};

function loadRecipe(name) {
    document.getElementById("mainImg").src = data[name].img;
    document.getElementById("title").innerText = data[name].title;
    document.getElementById("desc").innerText = data[name].desc;

    document.querySelectorAll(".recipe-list li").forEach(li => {
        li.classList.remove("active");
    });
    Event.currentTarget.classList.add("active");
}