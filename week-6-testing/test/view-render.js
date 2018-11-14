import test from "ava";
import request from "supertest";
import app from "../app";

test("List of people view render", async t => {
  const personToCreate = { name: "Armagan Amcalar", age: 33 };

  const creation = await request(app)
    .post("/person")
    .send(personToCreate);

  const res = await request(app).get("/person/all-list");

  t.is(res.status, 200);
});

test("People detail render", async t => {
  const personToCreate = { name: "Armagan Amcalar", age: 33 };

  const createdPerson = (await request(app)
    .post("/person")
    .send(personToCreate)).body;

  const res = await request(app).get(`/person/${createdPerson._id}`);

  t.is(res.status, 200);
});
