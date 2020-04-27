import * as qs from "./query";
import { joinUrl, stripUndefined } from "./util";

export type RequestOpts = {
  baseUrl?: string;
  fetch?: typeof fetch;
  headers?: Record<string, string | undefined>;
} & Omit<RequestInit, "body" | "headers">;

type FetchRequestOpts = RequestOpts & {
  body?: string | FormData;
};

type JsonRequestOpts = RequestOpts & {
  body: object;
};

export type ApiResponse = { status: number; data: any };

type MultipartRequestOpts = RequestOpts & {
  body: Record<string, string | Blob | undefined | any>;
};

export function runtime(defaults: RequestOpts) {
  async function fetchText(url: string, req?: FetchRequestOpts) {
    const { baseUrl, headers, fetch: customFetch, ...init } = {
      ...defaults,
      ...req,
    };
    const href = joinUrl(baseUrl, url);
    const res = await (customFetch || fetch)(href, {
      ...init,
      headers: stripUndefined({ ...defaults.headers, ...headers }),
    });
    let data;
    try {
      data = await res.text();
    } catch (err) {}

    return { status: res.status, data };
  }

  async function fetchJson<T extends ApiResponse>(
    url: string,
    req: FetchRequestOpts = {}
  ) {
    const { status, data } = await fetchText(url, {
      ...req,
      headers: {
        ...req.headers,
        Accept: "application/json",
      },
    });
    try {
      return { status, data: data && JSON.parse(data) } as T;
    } catch (err) {
      throw new Error(`Expected JSON but got: ${data}`);
    }
  }

  return {
    fetchText,
    fetchJson,

    json({ body, headers, ...req }: JsonRequestOpts) {
      return {
        ...req,
        body: JSON.stringify(body),
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      };
    },

    form({ body, headers, ...req }: JsonRequestOpts) {
      return {
        ...req,
        body: qs.form(body),
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
    },

    multipart({ body, ...req }: MultipartRequestOpts) {
      const data = new FormData();
      Object.entries(body).forEach(([name, value]) => {
        data.append(name, value);
      });
      return {
        ...req,
        body: data,
      };
    },
  };
}