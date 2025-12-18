// Dog Gallery — 20 images version

const breedSelect = document.getElementById('breedSelect');
const subBreedSelect = document.getElementById('subBreedSelect');
const subBreedLabel = document.getElementById('subBreedLabel');
const showBtn = document.getElementById('showBtn');
const randomBtn = document.getElementById('randomBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const gallery = document.getElementById('gallery');
const status = document.getElementById('status');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const viewFavsBtn = document.getElementById('viewFavsBtn');
const favoritesPanel = document.getElementById('favoritesPanel');
const favList = document.getElementById('favList');
const favEmpty = document.getElementById('favEmpty');
const closeFavs = document.getElementById('closeFavs');
const clearFavs = document.getElementById('clearFavs');
const favCountSpan = document.getElementById('favCount');

const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbClose = document.getElementById('lbClose');
const lbOpen = document.getElementById('lbOpen');
const lbDownload = document.getElementById('lbDownload');
const lbFav = document.getElementById('lbFav');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbIndex = document.getElementById('lbIndex');

const API_BASE = "https://dog.ceo/api";

let lastFetchParams = { breed: "all", subBreed: "", count: 20 };
let lastImages = [];
let favorites = loadFavorites();
let currentLightboxIndex = -1;

function setStatus(msg, error=false){
  status.textContent = msg;
  status.style.color = error ? "red" : "";
}

function loadFavorites(){
  try{
    const data = JSON.parse(localStorage.getItem("dog_favs_v1")) || [];
    favCountSpan.textContent = data.length;
    return data;
  }catch{
    return [];
  }
}
function saveFavorites(){
  localStorage.setItem("dog_favs_v1", JSON.stringify(favorites));
  favCountSpan.textContent = favorites.length;
}

function toggleFav(url){
  const i = favorites.indexOf(url);
  if(i>=0){
    favorites.splice(i,1);
    saveFavorites();
    return false;
  }
  favorites.unshift(url);
  saveFavorites();
  return true;
}

async function loadBreeds(){
  const res = await fetch(API_BASE + "/breeds/list/all");
  const data = await res.json();

  for(let breed in data.message){
    const op=document.createElement("option");
    op.value=breed;
    op.textContent=breed;
    breedSelect.appendChild(op);
  }
}

breedSelect.addEventListener("change", async()=>{
  const breed = breedSelect.value;
  subBreedSelect.classList.add("hidden");
  subBreedLabel.classList.add("hidden");
  subBreedSelect.innerHTML="";

  if(breed==="all") return;

  const res = await fetch(`${API_BASE}/breed/${breed}/list`);
  const data = await res.json();

  if(data.message.length){
    subBreedLabel.classList.remove("hidden");
    subBreedSelect.classList.remove("hidden");

    data.message.forEach(s=>{
      const op=document.createElement("option");
      op.value=s;
      op.textContent=s;
      subBreedSelect.appendChild(op);
    });
  }
});

async function fetchImages({breed,subBreed,count,append}){
  setStatus("Loading 20 images...");
  if(!append){
    gallery.innerHTML="";
    lastImages=[];
  }

  let url="";
  if(breed==="all"){
    url = `${API_BASE}/breeds/image/random/${count}`;
  } else if(subBreed){
    url = `${API_BASE}/breed/${breed}/${subBreed}/images/random/${count}`;
  } else {
    url = `${API_BASE}/breed/${breed}/images/random/${count}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  const imgs = Array.isArray(data.message)?data.message:[data.message];

  lastImages = append ? lastImages.concat(imgs) : imgs;

  populateGallery(lastImages);
  setStatus(`Showing ${lastImages.length} images.`);
}

function populateGallery(arr){
  gallery.innerHTML="";

  arr.forEach(url=>{
    const card=document.createElement("div");
    card.className="card";

    const wrap=document.createElement("div");
    wrap.className="imgwrap";

    const img=document.createElement("img");
    img.src=url;
    img.onclick=()=>openLightbox(url);

    const fav=document.createElement("div");
    fav.className="favBadge";

    const btn=document.createElement("button");
    btn.className="favBtn";
    btn.innerHTML = favorites.includes(url)? "♥":"♡";
    if(favorites.includes(url)) btn.classList.add("saved");

    btn.onclick=(e)=>{
      e.stopPropagation();
      const saved = toggleFav(url);
      btn.innerHTML = saved?"♥":"♡";
      btn.classList.toggle("saved",saved);
      renderFavPanel();
    }

    fav.appendChild(btn);
    wrap.appendChild(img);
    wrap.appendChild(fav);

    const meta=document.createElement("div");
    meta.className="meta";
    meta.innerHTML=`
      <span>${extractBreed(url)}</span>
      <button class="copyBtn">Copy</button>
    `;

    meta.querySelector(".copyBtn").onclick=async()=>{
      await navigator.clipboard.writeText(url);
      setStatus("Copied!");
    };

    card.appendChild(wrap);
    card.appendChild(meta);
    gallery.appendChild(card);
  });
}

function extractBreed(url){
  const parts=url.split("/");
  const breedPart=parts[parts.indexOf("breeds")+1];
  return breedPart.replace("-", " ");
}

clearBtn.onclick=()=>{
  gallery.innerHTML="";
  lastImages=[];
  setStatus("");
  breedSelect.value="all";
  subBreedSelect.classList.add("hidden");
};

showBtn.onclick=()=>{
  fetchImages({
    breed:breedSelect.value,
    subBreed:subBreedSelect.value,
    count:20,
    append:false
  });
};

randomBtn.onclick=()=>{
  fetchImages({breed:"all",count:20,append:false});
};

loadMoreBtn.onclick=()=>{
  fetchImages({...lastFetchParams,append:true});
};

searchInput.addEventListener("keydown",async e=>{
  if(e.key!=="Enter") return;

  const term = searchInput.value.toLowerCase();
  if(!term) return;

  setStatus("Searching...");
  const res = await fetch(API_BASE + "/breeds/list/all");
  const data = await res.json();

  const matches=[];
  for(let b in data.message){
    if(b.includes(term)) matches.push({b});
  }

  if(!matches.length){
    setStatus("No match");
    return;
  }

  fetchImages({breed:matches[0].b,subBreed:"",count:20,append:false});
});

/* FAVORITES PANEL */
viewFavsBtn.onclick=()=>{
  favoritesPanel.classList.toggle("hidden");
  renderFavPanel();
};
closeFavs.onclick=()=>favoritesPanel.classList.add("hidden");

clearFavs.onclick=()=>{
  favorites=[];
  saveFavorites();
  renderFavPanel();
};

function renderFavPanel(){
  favList.innerHTML="";
  if(!favorites.length){
    favEmpty.classList.remove("hidden");
    return;
  }
  favEmpty.classList.add("hidden");

  favorites.forEach(url=>{
    const item=document.createElement("div");
    item.className="favItem";

    const img=document.createElement("img");
    img.src=url;
    img.onclick=()=>openLightbox(url);

    const meta=document.createElement("div");
    meta.className="fmeta";
    meta.innerHTML = `
      <span>${extractBreed(url)}</span>
      <button class="btn ghost">Remove</button>
    `;

    meta.querySelector("button").onclick=()=>{
      toggleFav(url);
      renderFavPanel();
      populateGallery(lastImages);
    };

    item.appendChild(img);
    item.appendChild(meta);
    favList.appendChild(item);
  });
}

/* LIGHTBOX */
function openLightbox(url){
  let index = lastImages.indexOf(url);
  if(index === -1) index = 0;

  showLightbox(index);
}

function showLightbox(i){
  currentLightboxIndex = i;
  const url = lastImages[i];

  lbImage.src=url;
  lbOpen.href=url;
  lbIndex.textContent = `${i+1} / ${lastImages.length}`;
  lbFav.textContent = favorites.includes(url) ? "♥ Favorited" : "♥ Favorite";

  lbFav.onclick=()=>{
    const saved = toggleFav(url);
    lbFav.textContent = saved ? "♥ Favorited" : "♥ Favorite";
    renderFavPanel();
  };

  lbDownload.onclick=()=>downloadImg(url);

  lightbox.classList.remove("hidden");
}

lbPrev.onclick=()=>navigate(-1);
lbNext.onclick=()=>navigate(1);

function navigate(step){
  let n = currentLightboxIndex + step;
  if(n<0) n = lastImages.length-1;
  if(n>=lastImages.length) n = 0;
  showLightbox(n);
}

lbClose.onclick=()=>lightbox.classList.add("hidden");

window.addEventListener("keydown",e=>{
  if(lightbox.classList.contains("hidden")) return;

  if(e.key==="Escape") lightbox.classList.add("hidden");
  if(e.key==="ArrowLeft") navigate(-1);
  if(e.key==="ArrowRight") navigate(1);
});

async function downloadImg(url){
  const res = await fetch(url);
  const blob = await res.blob();

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "dog.jpg";
  a.click();
}

loadBreeds();
fetchImages({breed:"all",count:20,append:false});
