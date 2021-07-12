import * as qs from "./query";
import { joinUrl, stripUndefined } from "./util";
import { ok } from "../";

export type RequestOpts = {
  baseUrl?: string;
  fetch?: typeof fetch;
  formDataConstructor?: new () => FormData;
  headers?: Record<string, string | undefined>;
} & Omit<RequestInit, "body" | "headers">;

type FetchRequestOpts = RequestOpts & {
  body?: string | FormData;
};

type JsonRequestOpts = RequestOpts & {
  body?: object;
};

export type ApiResponse = {
  status: number;
  data?: any;
  headers: Headers;
};

type MultipartRequestOpts = RequestOpts & {
  body?: Record<string, string | Blob | undefined | any>;
};

export function runtime(defaults: RequestOpts) {
  async function fetchText(url: string, req?: FetchRequestOpts) {
    const res = await doFetch(url, req);
    let data;
    try {
      data = await res.text();
    } catch (err) {}

    return {
      status: res.status,
      contentType: res.headers.get("content-type"),
      data,
      headers: res.headers,
    };
  }

  async function fetchJson<T extends ApiResponse>(
    url: string,
    req: FetchRequestOpts = {}
  ) {
    const { status, contentType, data, headers } = await fetchText(url, {
      ...req,
      headers: {
        ...req.headers,
        Accept: "application/json",
      },
    });

    const jsonTypes = ["application/json", "application/hal+json"];
    const isJson = contentType
      ? jsonTypes.some((mimeType) => contentType.includes(mimeType))
      : false;

    if (isJson) {
      return { status, data: data ? JSON.parse(data) : null, headers } as T;
    }

    return { status, data, headers } as T;
  }

  async function fetchBlob<T extends ApiResponse>(
    url: string,
    req: FetchRequestOpts = {}
  ) {
    const res = await doFetch(url, req);
    let data;
    try {
      data = await res.blob();
    } catch (err) {}
    return {
      status: res.status,
      data,
      headers: res.headers,
    } as T;
  }

  async function doFetch(url: string, req: FetchRequestOpts = {}) {
    const {
      baseUrl,
      headers,
      fetch: customFetch,
      ...init
    } = {
      ...defaults,
      ...req,
    };
    const href = joinUrl(baseUrl, url);
    const res = await (customFetch || fetch)(href, {
      ...init,
      headers: stripUndefined({ ...defaults.headers, ...headers }),
    });
    return res;
  }

  return {
    ok,
    fetchText,
    fetchJson,
    fetchBlob,

    json({ body, headers, ...req }: JsonRequestOpts) {
      return {
        ...req,
        ...(body && { body: JSON.stringify(body) }),
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      };
    },

    form({ body, headers, ...req }: JsonRequestOpts) {
      return {
        ...req,
        ...(body && { body: qs.form(body) }),
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
    },

    multipart({ body, ...req }: MultipartRequestOpts) {
      if (!body) return req;
      const data = new (defaults.formDataConstructor ||
        req.formDataConstructor ||
        FormData)();
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
