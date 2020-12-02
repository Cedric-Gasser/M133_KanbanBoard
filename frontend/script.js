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
    //to be implemented
}

function cardToHtml(card){
    cardHtml = `<li><div class="card" id="${card.id}">${card.text}</div></li>`;
    return cardHtml;
}

//run this to reload all columns (when for example you added a new card..)
loadColumns()
