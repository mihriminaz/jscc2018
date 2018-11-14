import test from "ava";
import request from "supertest";
import app from "../app";

test("Attend to a meetup", async t => {
  t.plan(7);

  const person1ToCreate = { name: "Anna Pavlova", age: 29 };
  const person2ToCreate = { name: "Celia Gomez", age: 29 };
  const person3ToCreate = { name: "Omur Turan", age: 30 };
  const meetupToCreate = {
    name: "Testing Session",
    location: "unu GmbH",
    attendees: []
  };

  const meetupCreated = (await request(app)
    .post("/meetup")
    .send(meetupToCreate)).body;

  const annaUser = (await request(app)
    .post("/person")
    .send(person1ToCreate)).body;

  const attendReq = (await request(app)
    .post(`/meetup/${meetupCreated._id}/addAttendee`)
    .send({ personId: annaUser._id })).body;

  const fetchRes = await request(app).get(`/meetup/${meetupCreated._id}/json`);

  const meetupFetched = fetchRes.body;

  t.is(fetchRes.status, 200);
  t.notDeepEqual(meetupFetched, meetupCreated);
  t.deepEqual(meetupFetched.attendees[0], annaUser);

  const celiaUser = (await request(app)
    .post("/person")
    .send(person2ToCreate)).body;

  const attendCeliaReq = (await request(app)
    .post(`/meetup/${meetupCreated._id}/addAttendee`)
    .send({ personId: celiaUser._id })).body;

  const omurUser = (await request(app)
    .post("/person")
    .send(person3ToCreate)).body;

  const attendOmurReq = (await request(app)
    .post(`/meetup/${meetupCreated._id}/addAttendee`)
    .send({ personId: omurUser._id })).body;

  const fetchFinalRes = await request(app).get(
    `/meetup/${meetupCreated._id}/json`
  );

  const meetupFetchedFinal = fetchFinalRes.body;

  t.is(fetchRes.status, 200);
  t.deepEqual(meetupFetchedFinal.attendees.length, 3);
  t.deepEqual(meetupFetchedFinal.attendees[1], celiaUser);
  t.deepEqual(meetupFetchedFinal.attendees[2], omurUser);
});
