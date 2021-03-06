async function getCards(){
    // getting the cards
    let response = await fetch('http://localhost:8000/cards');
    let cards = await response.json();

    // emptying the columns
    for (var column in columns){
        columns[column].innerHTML = "";
    }

    // refilling the columns
    cards.forEach((card) => {
        htmlCard = cardToHtml(card);
        columns[card.status].appendChild(htmlCard);
    });
}

// post card to backend and reloads
async function postCard(card){
    fetch('/cards', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    });
    getCards();
}

// put card to backend and reload
async function putCard(card, id){
    fetch(`/cards/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    });
    getCards();
}

// delete card in backend and reload
async function deleteCard(id){
    fetch(`/cards/${id}`, {
        method: 'delete',
    });
    getCards();
}

// converts json card to html object
function cardToHtml(card){
    let li = document.createElement('li');
    li.draggable="true";
    li.ondragstart = (event) => drag(event);
    let div = document.createElement('div');
    div.id = card.id;
    div.class = "card";

    let p = document.createElement('p');
    p.innerText = card.text;

    let buttonDelete = document.createElement('button');
    buttonDelete.innerText = "×";
    buttonDelete.addEventListener("click", event => OnDeleteCard(event));

    div.appendChild(p);
    div.appendChild(buttonDelete);

    li.appendChild(div);

    return li;
}

// Eventfunctions
let OnAddCard = (event) => {
    let target = event.target || event.srcElement;
    let status = target.closest('div').querySelector('ul').id;
    let text = target.closest('div').querySelector('input[type="text"]').value;
    target.closest('div').querySelector('input[type="text"]').value = "";
    card = {
        "text": text,
        "status": status,
    } 
    postCard(card);
}

let OnDeleteCard = (event) => {
    let target = event.target || event.srcElement;
    let id = target.closest('div').id;
    deleteCard(id);
}

// getting the unordered lists
let columns = {};
for (columnDiv of document.getElementsByClassName('column')){
    let ul = columnDiv.querySelector('ul');
    columns[ul.id] = ul;
    ul.ondragover = (event) => allowDrop(event);
    ul.ondrop = (event) => drop(event);
    ul.ondragleave = (event) => leave(event);
}

// Add Eventhandlers
let btnAddCardList = document.getElementsByClassName("btnAddCard");
for (let btn of btnAddCardList) {
    btn.addEventListener("click", event => OnAddCard(event));
}
let txtAddCardList = document.getElementsByClassName("txtAddCard");
for (let btn of txtAddCardList) {
    btn.addEventListener("keyup", event => {
        if (event.keyCode == 13){
            OnAddCard(event);
        }
    });
}

// Drag n' Drop
let allowDrop = (event) => {
    event.currentTarget.style = "border-color: #eee";
    event.preventDefault();
}

let drag = (event) => {
    event.dataTransfer.setData("text", event.target.querySelector('div').id);
}

let drop = (event) => {
    event.currentTarget.style = "border-color: white";
    event.preventDefault();
    let id = event.dataTransfer.getData("text");
    event.target.closest('ul').appendChild(document.getElementById(id));
    card = {"status": event.target.closest('ul').id};
    putCard(card, id);
}

let leave = (event) => {
  event.currentTarget.style = "border-color: white";
};

// load cards at start
getCards();