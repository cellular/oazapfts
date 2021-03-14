import * as api from "./api";
import * as optimisticApi from "./optimisticApi";

import { handle, ok, okify, optimistic } from "oazapfts/lib/index";

import Blob from "cross-blob";

api.defaults.baseUrl = `${process.env.SERVER_URL}/v2`;
optimisticApi.defaults.baseUrl = `${process.env.SERVER_URL}/v2`;

(global as any).fetch = require("node-fetch");
(global as any).FormData = require("form-data");

describe("ok", () => {
  it("should get pets by id", async () => {
    const pet = await ok(api.getPetById(1));
    expect(pet).toMatchObject({ id: 1, name: "doggie" });
  });

  it("should throw if status != 200", async () => {
    const promise = ok(
      api.getPetById(4, { headers: { Prefer: "statusCode=404" } })
    );
    await expect(promise).rejects.toHaveProperty("status", 404);
  });

  it("should post json", async () => {
    const order = await ok(
      api.placeOrder({
        petId: 1,
        status: "placed",
        quantity: 1,
      })
    );
    expect(order).toMatchObject({
      quantity: 1,
      status: "placed",
    });
  });

  it("should type response as Pet|string", async () => {
    const pet = await ok(api.addPet({ name: "doggie", photoUrls: [] }));
    //@ts-expect-error
    expect(pet.name).toBe("doggie");
  });
});

describe("handle", () => {
  it("should call the matching handler", async () => {
    const res = await handle(api.updatePet({ name: "Gizmo", photoUrls: [] }), {
      204() {
        return "204 called";
      },
    });
    expect(res).toBe("204 called");
  });

  it("should call the default handler", async () => {
    const res = await handle(
      api.updatePet({} as any), // provoke 404 error
      {
        default(status, data) {
          return "default called";
        },
      }
    );
    expect(res).toBe("default called");
  });

  it("should throw if status is unhandled", async () => {
    const promise = handle(api.updatePet({ name: "Gizmo", photoUrls: [] }), {});
    await expect(promise).rejects.toHaveProperty("status", 204);
  });
});

describe("okify", () => {
  it("should okify a single function", async () => {
    const getPetById = okify(api.getPetById);
    const pet = await getPetById(1);
    expect(pet).toMatchObject({ id: 1, name: "doggie" });
  });
});

describe("optimistic", () => {
  it("should okify all functions", async () => {
    const optimisticApi = optimistic(api);
    const pet = await optimisticApi.getPetById(1);
    expect(pet).toMatchObject({ id: 1, name: "doggie" });
  });
});

describe("--optimistic", () => {
  it("should get pets by id", async () => {
    const pet = await optimisticApi.getPetById(1);
    expect(pet).toMatchObject({ id: 1, name: "doggie" });
  });

  it("should throw if status != 200", async () => {
    const promise = optimisticApi.getPetById(4, {
      headers: { Prefer: "statusCode=404" },
    });
    await expect(promise).rejects.toHaveProperty("status", 404);
  });

  it("should post json", async () => {
    const order = await optimisticApi.placeOrder({
      petId: 1,
      status: "placed",
      quantity: 1,
    });

    expect(order).toMatchObject({
      quantity: 1,
      status: "placed",
    });
  });

  it("should type response as Pet|string", async () => {
    const pet = await optimisticApi.addPet({ name: "doggie", photoUrls: [] });
    //@ts-expect-error
    expect(pet.name).toBe("doggie");
  });
});

describe("Blob", () => {
  it("should be uploaded", async () => {
    const emptyPng = new Blob(
      [
        Uint8Array.of(
          0x89,
          0x50,
          0x4e,
          0x47,
          0xd,
          0xa,
          0x1a,
          0xa,
          0x0,
          0x0,
          0x0,
          0xd,
          0x49,
          0x48,
          0x44,
          0x52,
          0x0,
          0x0,
          0x0,
          0x1,
          0x0,
          0x0,
          0x0,
          0x1,
          0x1,
          0x3,
          0x0,
          0x0,
          0x0,
          0x25,
          0xdb,
          0x56,
          0xca,
          0x0,
          0x0,
          0x0,
          0x3,
          0x50,
          0x4c,
          0x54,
          0x45,
          0x0,
          0x0,
          0x0,
          0xa7,
          0x7a,
          0x3d,
          0xda,
          0x0,
          0x0,
          0x0,
          0x1,
          0x74,
          0x52,
          0x4e,
          0x53,
          0x0,
          0x40,
          0xe6,
          0xd8,
          0x66,
          0x0,
          0x0,
          0x0,
          0xa,
          0x49,
          0x44,
          0x41,
          0x54,
          0x8,
          0xd7,
          0x63,
          0x60,
          0x0,
          0x0,
          0x0,
          0x2,
          0x0,
          0x1,
          0xe2,
          0x21,
          0xbc,
          0x33,
          0x0,
          0x0,
          0x0,
          0x0,
          0x49,
          0x45,
          0x4e,
          0x44,
          0xae,
          0x42,
          0x60,
          0x82
        ),
      ],
      {
        type: "image/png",
      }
    );

    const up = await api.uploadPng(emptyPng);

    expect(up).toMatchObject({
      code: 200,
      type: "OK",
      message: "OK",
    });
  });
});
