import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts"
const app = new Application()
const router = new Router()

/*
card object structure:
card = {
    "id": 0,
    "text": "Card Text",
    "status": "culumn name"
}
*/

let cards = [];

let counter = 0;

cards = [
    ...cards,
    {
    "id": counter,
    "text": "Drink some Coffee",
    "status": "ToDo",
    }
];

counter++

router
    .get("/cards", context => context.response.body = cards)
    .get("/cards/:id", context => {
        const index = cards.findIndex(c => c.id == context.params.id);
        context.response.body = cards[index]
    })
    .post("/cards", async context => {
        const card = await context.request.body({ type: "json" }).value;
        card.id = counter;
        counter++;
        cards = [
            ...cards,
            card
        ];
        context.response.body = card
    })
    .delete("/cards/:id", context => {
        const id = context.params.id;
        cards = cards.filter(p => p.id != id);
    })
    .put("/cards/:id", async context => {
        console.log(context.request);
        const card = await context.request.body({ type: "json" }).value;
        console.log("id:", context.params.id);
        console.log("card", card);
        const index = cards.findIndex(c => c.id == context.params.id);
        card.id = cards[index].id;
        cards[index] = card;
        context.response.body = cards[index]
    });

app.use(router.routes());
app.use(async context => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/frontend`,
      index: "index.html",
    });
  });
app.listen({ port: 8000 });
