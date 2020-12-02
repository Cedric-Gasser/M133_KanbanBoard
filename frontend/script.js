//getting the unordered lists
let columnDivs = document.getElementsByClassName('column');
let columns = {};
for (columnDiv of columnDivs){
    let ul = columnDiv.querySelector('ul');
    columns[ul.id] = ul;
}

loadColumns = async function (){
    //getting the cards
    let response = await fetch('http://localhost:8000/cards');
    let cards = await response.json();

    //emptying the lists
    for (var column in columns){
        columns[column].innerHTML = "";
    }

    //refilling the lists
    cards.forEach((card) => {
        htmlCard = cardToHtml(card);
        columns[card.status].innerHTML += htmlCard;
    });
}

newCard = async function (card){
    let response = fetch('http://localhost:8000/cards', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
    });
    loadColumns();
}

function cardToHtml(card){
    cardHtml = `<li><div class="card" id="${card.id}">${card.text}</div></li>`;
    return cardHtml;
}

//run this to reload all columns (when for example you added a new card..)
loadColumns();

let btnList = document.getElementsByClassName("btnAddCard");
for (let btn of btnList) {
    btn.addEventListener("click", (event) => {
        let target = event.target || event.srcElement;
        let status = target.closest('div').querySelector('ul').id;
        let text = target.closest('div').querySelector('input[type="text"]').value;

        card = {
            "text": text,
            "status": status,
        }
        newCard(card);
    });
}