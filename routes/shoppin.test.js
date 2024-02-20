process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let shoppingList = require("../fakeDb");

let icecream = { name: "icecream", price: "3.99" };

beforeEach(function () {
  shoppingList.push(icecream);
});

afterEach(function () {
  shoppingList.length = 0;
});

describe("GET /shopping", function () {
  test("Gets a list of shopping list items", async function () {
    const resp = await request(app).get("/shopping");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ shoppingList: [icecream] });
  });
});

describe("POST /shopping", () => {
  test("Creating a shopping list item", async () => {
    const res = await request(app).post("/shopping").send({
      name: "ramen",
      price: "1.99",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "ramen", price: "1.99" } });
  });
  test("Responds with 400 if name or price is missing", async () => {
    const res = await request(app).post("/shopping").send({ name: "eggs" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Name and price are required!",
    });
  });
});

describe("GET /shopping/:name", () => {
  test("Get one shopping list item", async function () {
    const res = await request(app).get(`/shopping/${icecream.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: icecream });
  });
  test("Responds with 404 for invalid item", async function () {
    const res = await request(app).get(`/shopping/tuna`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
});

describe("/PATCH /shopping/:name", () => {
  test("Updating a shopping list item", async () => {
    const res = await request(app)
      .patch(`/shopping/${icecream.name}`)
      .send({ name: "icecream", price: 1.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "icecream", price: 1.99 } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/shopping/tuna`)
      .send({ name: "Tuna", price: "500" });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /shopping/:name", () => {
  test("Deleting an item from shopping list", async () => {
    const res = await request(app).delete(`/shopping/${icecream.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/shopping/ham`);
    expect(res.statusCode).toBe(404);
  });
});
