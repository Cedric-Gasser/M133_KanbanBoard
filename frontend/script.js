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
    fetch('http://localhost:8000/cards', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    });
    getCards();
}

// put card to backend and reload
async function putCard(card, id){
    fetch(`http://localhost:8000/cards/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    });
    getCards();
}

// converts json card to html object
function cardToHtml(card){
    let li = document.createElement('li');
    let div = document.createElement('div');
    div.id = card.id;
    div.class = "card";

    let p = document.createElement('p');
    p.innerText = card.text;

    let buttonLeft = document.createElement('button');
    buttonLeft.innerText = "<";
    buttonLeft.addEventListener("click", event => OnMoveLeft(event));
    let buttonRight = document.createElement('button');
    buttonRight.innerText = ">";
    buttonRight.addEventListener("click", event => OnMoveRight(event));
    let buttonDelete = document.createElement('button');
    buttonDelete.innerText = "delete";

    div.appendChild(p);
    div.appendChild(buttonLeft);
    div.appendChild(buttonRight);
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

let OnMoveLeft = (event) => {
    let target = event.target || event.srcElement;
    let status = target.closest('ul').id;
    let id = target.closest('div').id;
    let card = {"status": status};
    if (status == "In progress") {
        card.status = "To do";
    } else if (status == "Done") {
        card.status = "In progress";
    }
    putCard(card, id);
}

let OnMoveRight = (event) => {
    let target = event.target || event.srcElement;
    let status = target.closest('ul').id;
    let id = target.closest('div').id;
    let card = {"status": status};
    if (status == "To do") {
        card.status = "In progress";
    } else if (status == "In progress") {
        card.status = "Done";
    }
    putCard(card, id);
}

let OnDelete = (event) => {
    // to be implemented <----
}

// getting the unordered lists
let columns = {};
for (columnDiv of document.getElementsByClassName('column')){
    let ul = columnDiv.querySelector('ul');
    columns[ul.id] = ul;
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

// load cards at start
getCards();