import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts"
const app = new Application()
const router = new Router()

/*
card object expected structure:
card = {
    "id": 0,
    "text": "Card Text",
    "status": "culumn name"
}
*/

cards = []

counter = 0

router
    .get("/cards", context => context.response.body = cards)
    .get("/cards/:id", context => {
        const index = cards.findIndex(c => c.id == id);
        context.response.body = cards[index]
    })
    .post("/cards", async context => {
        const card = await context.request.body({ type: "json" }).value;
        card.id = counter;
        cards = [
            ...cards,
            card
        ];
        counter++;
    })
    .delete("/cards/:id", context => {
        const id = context.params.id;
        cards = cards.filter(p => p.id != id);
    })
    .put("/cards/:id", async context => {
        const card = await context.request.body({ type: "json" }).value;
        const id = context.params.id;
        const index = cards.findIndex(c => c.id == id);
        cards[index] = card;
    });

app.use(router.routes());
app.use(async context => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/frontend`,
      index: "index.html",
    });
  });
app.listen({ port: 8000 })
