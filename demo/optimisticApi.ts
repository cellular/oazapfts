/**
 * Swagger Petstore
 * 1.0.0
 * DO NOT MODIFY - This file has been generated using oazapfts.
 * See https://www.npmjs.com/package/oazapfts
 */
import * as Oazapfts from "oazapfts/lib/runtime";
import * as QS from "oazapfts/lib/runtime/query";
export const defaults: Oazapfts.RequestOpts = {
  baseUrl: "https://petstore.swagger.io/v2",
};
const oazapfts = Oazapfts.runtime(defaults);
export const servers = {
  server1: "https://petstore.swagger.io/v2",
  server2: "http://petstore.swagger.io/v2",
};
export type Category = {
  id?: number;
  name?: string;
};
export type Tag = {
  id?: number;
  name?: string;
};
export type Pet = {
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: "available" | "pending" | "sold";
  animal?: true;
};
export type ApiResponse = {
  code?: number;
  type?: string;
  message?: string;
};
export type Order = {
  id?: number;
  petId?: number;
  quantity?: number;
  shipDate?: string;
  status?: "placed" | "approved" | "delivered";
  complete?: boolean;
};
export type User = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  userStatus?: number;
};
export type Schema = string;
export type Schema2 = number;
/**
 * Update an existing pet
 */
export function updatePet(pet: Pet, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 204;
          data: string;
        }
      | {
          status: 404;
          data: string;
        }
      | {
          status: number;
          data: {
            errors?: string[];
          };
        }
    >(
      "/pet",
      oazapfts.json({
        ...opts,
        method: "PUT",
        body: pet,
      })
    )
  );
}
/**
 * Add a new pet to the store
 */
export function addPet(pet: Pet, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: Pet;
        }
      | {
          status: 201;
          data: {
            id?: string;
          };
        }
    >(
      "/pet",
      oazapfts.json({
        ...opts,
        method: "POST",
        body: pet,
      })
    )
  );
}
/**
 * Finds Pets by status
 */
export function findPetsByStatus(
  status: ("available" | "pending" | "sold")[],
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: Pet[];
        }
      | {
          status: 400;
          data: string;
        }
    >(
      `/pet/findByStatus${QS.query(
        QS.explode({
          status,
        })
      )}`,
      {
        ...opts,
      }
    )
  );
}
/**
 * Finds Pets by tags
 */
export function findPetsByTags(tags: string[], opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: Pet[];
        }
      | {
          status: 400;
          data: string;
        }
    >(
      `/pet/findByTags${QS.query(
        QS.explode({
          tags,
        })
      )}`,
      {
        ...opts,
      }
    )
  );
}
/**
 * Find pet by ID
 */
export function getPetById(petId: number, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: Pet;
        }
      | {
          status: 400;
          data: string;
        }
      | {
          status: 404;
        }
    >(`/pet/${encodeURIComponent(petId)}`, {
      ...opts,
    })
  );
}
/**
 * Updates a pet in the store with form data
 */
export function updatePetWithForm(
  petId: number,
  body?: {
    name?: string;
    status?: string;
  },
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(
      `/pet/${encodeURIComponent(petId)}`,
      oazapfts.form({
        ...opts,
        method: "POST",
        body,
      })
    )
  );
}
/**
 * Deletes a pet
 */
export function deletePet(
  petId: number,
  {
    apiKey,
  }: {
    apiKey?: string;
  } = {},
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(`/pet/${encodeURIComponent(petId)}`, {
      ...opts,
      method: "DELETE",
      headers: {
        ...(opts && opts.headers),
        api_key: apiKey,
      },
    })
  );
}
/**
 * uploads an image
 */
export function uploadFile(
  petId: number,
  body?: {
    additionalMetadata?: string;
    file?: Blob;
  },
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchJson<{
      status: 200;
      data: ApiResponse;
    }>(
      `/pet/${encodeURIComponent(petId)}/uploadImage`,
      oazapfts.multipart({
        ...opts,
        method: "POST",
        body,
      })
    )
  );
}
/**
 * Returns pet inventories by status
 */
export function getInventory(opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<{
      status: 200;
      data: {
        [key: string]: number;
      };
    }>("/store/inventory", {
      ...opts,
    })
  );
}
/**
 * Place an order for a pet
 */
export function placeOrder(order: Order, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: Order;
        }
      | {
          status: 400;
          data: string;
        }
    >(
      "/store/order",
      oazapfts.json({
        ...opts,
        method: "POST",
        body: order,
      })
    )
  );
}
/**
 * Find purchase order by ID
 */
export function getOrderById(orderId: number, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: Order;
        }
      | {
          status: 400;
          data: string;
        }
      | {
          status: 404;
          data: string;
        }
    >(`/store/order/${encodeURIComponent(orderId)}`, {
      ...opts,
    })
  );
}
/**
 * Delete purchase order by ID
 */
export function deleteOrder(orderId: number, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchText(`/store/order/${encodeURIComponent(orderId)}`, {
      ...opts,
      method: "DELETE",
    })
  );
}
/**
 * Create user
 */
export function createUser(user: User, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchText(
      "/user",
      oazapfts.json({
        ...opts,
        method: "POST",
        body: user,
      })
    )
  );
}
/**
 * Creates list of users with given input array
 */
export function createUsersWithArrayInput(
  body: User[],
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(
      "/user/createWithArray",
      oazapfts.json({
        ...opts,
        method: "POST",
        body,
      })
    )
  );
}
/**
 * Creates list of users with given input array
 */
export function createUsersWithListInput(
  body: User[],
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(
      "/user/createWithList",
      oazapfts.json({
        ...opts,
        method: "POST",
        body,
      })
    )
  );
}
/**
 * Logs user into the system
 */
export function loginUser(
  username: string,
  password: string,
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: string;
        }
      | {
          status: 400;
          data: string;
        }
    >(
      `/user/login${QS.query(
        QS.form({
          username,
          password,
        })
      )}`,
      {
        ...opts,
      }
    )
  );
}
/**
 * Logs out current logged in user session
 */
export function logoutUser(opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchText("/user/logout", {
      ...opts,
    })
  );
}
/**
 * Get user by user name
 */
export function getUserByName(username: string, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchJson<
      | {
          status: 200;
          data: User;
        }
      | {
          status: 400;
          data: string;
        }
      | {
          status: 404;
          data: string;
        }
    >(`/user/${encodeURIComponent(username)}`, {
      ...opts,
    })
  );
}
/**
 * Updated user
 */
export function updateUser(
  username: string,
  user: User,
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(
      `/user/${encodeURIComponent(username)}`,
      oazapfts.json({
        ...opts,
        method: "PUT",
        body: user,
      })
    )
  );
}
/**
 * Delete user
 */
export function deleteUser(username: string, opts?: Oazapfts.RequestOpts) {
  return oazapfts.ok(
    oazapfts.fetchText(`/user/${encodeURIComponent(username)}`, {
      ...opts,
      method: "DELETE",
    })
  );
}
export function customizePet(
  {
    furColor,
    color,
    xColorOptions,
  }: {
    furColor?: string;
    color?: string;
    xColorOptions?: string;
  } = {},
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(
      `/pet/customize${QS.query(
        QS.form({
          "fur.color": furColor,
          color,
        })
      )}`,
      {
        ...opts,
        method: "POST",
        headers: {
          ...(opts && opts.headers),
          "x-color-options": xColorOptions,
        },
      }
    )
  );
}
export function getIssue31ByFoo(
  foo: string,
  {
    bar,
    baz,
    boo,
  }: {
    bar?: Schema;
    baz?: number;
    boo?: Schema2;
  } = {},
  opts?: Oazapfts.RequestOpts
) {
  return oazapfts.ok(
    oazapfts.fetchText(
      `/issue31/${encodeURIComponent(foo)}${QS.query(
        QS.form({
          bar,
          baz,
          boo,
        })
      )}`,
      {
        ...opts,
      }
    )
  );
}
