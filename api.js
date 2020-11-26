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
    "text": "Drink some Coffee",
    "status": "ToDo",
    "id": counter,
    }
];

counter++

router
    .get("/cards", context => context.response.body = cards)
    .get("/cards/:id", context => {
        const index = cards.findIndex(c => c.id == context.params.id);
        if (index >= 0){
            context.response.body = cards[index]
        } else {
            context.response.status = 404
            context.response.body = `ID ${context.params.id} not found`
        }
        
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
        context.response.status = 201
    })
    .delete("/cards/:id", context => {
        cards = cards.filter(c => c.id != context.params.id);
        context.response.status = 200
    })
    .put("/cards/:id", async context => {
        const card = await context.request.body({ type: "json" }).value;
        const index = cards.findIndex(c => c.id == context.params.id);
        if (index >= 0){
            card.id = cards[index].id;
            cards[index] = card;
            context.response.body = cards[index];
        } else {
            context.response.status = 404
            context.response.body = `ID ${context.params.id} not found`
        }
    });

app.use(router.routes());
app.use(async context => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/frontend`,
      index: "index.html",
    });
  });
app.listen({ port: 8000 });
