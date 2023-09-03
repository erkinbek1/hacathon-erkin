//! Сохроняем API (база данных) в перемненную API
const API = "http://localhost:8001/foods";

let inpName = document.getElementById("inpName");
let inpInfo = document.getElementById("inpInfo");
let inpImage = document.getElementById("inpImage");
let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let btnOpenForm = document.getElementById("flush-collapseOne");
let sectionFoods = document.getElementById("sectionFoods");
let searchValue = ""; // для поиска
let prevBtn = document.getElementById("prevBtn"); //плагинация
let nextBtn = document.getElementById("nextBtn");
let currentPage = 1; // преерменная для плагинации
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpInfo.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните поля!");
    return;
  }

  let newFood = {
    foodName: inpName.value,
    foodInfo: inpInfo.value,
    foodImage: inpImage.value,
    foodPrice: inpPrice.value,
  };
  createFood(newFood);
  readFoods();
});

//! create
function createFood(food) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(food),
  }).then(() => readFoods());
  inpName.value = "";
  inpInfo.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  btnOpenForm.classList.toggle("show");
}

//! read отображение данных

function readFoods() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=8`)
    .then((res) => res.json())
    .then((data) => {
      sectionFoods.innerHTML = "";
      data.forEach((item) => {
        sectionFoods.innerHTML += `
                    <div class="card md-4 cardBook mx-auto mb-3 bg-secondary" style="width: 18rem">
                        <img id="${item.id}" src="${item.foodImage}" 
                        class="card-img-top detailsCard" 
                        style="height:280px" alt="${item.foodName}"/>
                        <div class="card-body">
                            <h5 class="card-title text-light">
                            ${item.foodName}
                            </h5>
                            <p class="card-text text-light">
                            ${item.foodInfo}
                            </p>
                            <p class="card-text text-light">
                            ${item.foodPrice}
                            </p>
                            <button class="btn btn-outline-danger btnDelete text-light bg-danger" id="${item.id}">Delete</button>
                            <button class="btn btn-outline-warning btnEdit text-light bg-warning" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                        </div>
                    </div>
                `;
      });
      pageFunc();
    });
}
readFoods();

//! delete

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readFoods());
  }
});

//! edit

let editInpName = document.getElementById("editInpName");
let editInpInfo = document.getElementById("editInpInfo");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.foodName;
        editInpInfo.value = data.foodInfo;
        editInpImage.value = data.foodImage;
        editInpPrice.value = data.foodPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedBook = {
    foodName: editInpName.value,
    foodInfo: editInpInfo.value,
    foodImage: editInpImage.value,
    foodPrice: editInpPrice.value,
  };
  editFood(editedBook, editBtnSave.id);
});

function editFood(editedBook, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedBook),
  }).then(() => readFoods());
}

// search
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (e) => {
  e.preventDefault();
  searchValue = e.target.value;
  readFoods();
});

//paginattion
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 8);
    });
}

prevBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (currentPage <= 1) return;
  currentPage--;
  readFoods();
});

nextBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (currentPage >= countPage) return;
  currentPage++;
  readFoods();
});
