/**
 * Helper for our server API.
 *
 * Few assumptions are taken here.
 * - all request and response are in JSON (beside of GET
 * parameters which are in the query string);
 * - successful response must have `"success":true` field;
 * - error response bares an error message in `"error":...` field.
 *
 * We still have some legacy calls using `fetch` and form data,
 * but we'll pursue using this API whenever possible.
 */
export namespace API {

  export function get(url: string, data?: any): Promise<any> {
    if (data) {
      const queryparams: Record<string, string> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value == undefined) {
        } else if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
          queryparams[key] = `${value}`;
        } else {
          queryparams[key] = JSON.stringify(value);
        }
      }
      url += `?` + Object.entries(queryparams)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
    }

    return fetch(url).then(__handleResponse);
  }

  export function post(url: string, data?: any): Promise<any> {
    return __fetchWithPayload('POST', url, data);
  }

  export function put(url: string, data?: any): Promise<any> {
    return __fetchWithPayload('PUT', url, data);
  }

  export function patch(url: string, data?: any): Promise<any> {
    return __fetchWithPayload('PATCH', url, data);
  }

  export function del(url: string) {
    return fetch(url, { method: 'DELETE' }).then(__handleResponse);
  }

  function __fetchWithPayload(method: string, url: string, data: any) {
    const init: RequestInit = { method: method };
    if (data != undefined) {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify(data);
    }
    return fetch(url, init).then(__handleResponse);
  }

  function __handleResponse(response: Response) {
    return response.json().then((data) => {
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    });
  }
}