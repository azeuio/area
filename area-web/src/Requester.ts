/**
 * @class Requester
 * @description Handles requests to external services
 */

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
class Requester {
  // private Accept: string = 'application/json';
  // private ContentType: string = 'application/json';
  // private token: string = '';
  // private tokenType: string = 'Bearer';
  // private headers_: HeadersInit = {
  //   Accept: this.Accept,
  //   'Content-Type': this.ContentType,
  // };
  // private body_: BodyInit = '';

  public constructor(
    private headers_: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    private body_: BodyInit = '',
    private token: string = '',
    private tokenType: string = 'Bearer',
  ) {}

  public authorization(token: string, tokenType: string = 'Bearer'): Requester {
    const requester = new Requester(
      this.headers_,
      this.body_,
      this.token,
      this.tokenType,
    );
    requester.token = token;
    requester.tokenType = tokenType || this.tokenType;
    requester.headers_ = {
      ...this.headers_,
      Authorization: `${requester.tokenType} ${requester.token}`,
    };
    return requester;
  }

  public headers(headers: HeadersInit): Requester {
    return new Requester(headers, this.body_, this.token, this.tokenType);
  }

  public accept(accept: string): Requester {
    return this.headers({
      ...this.headers_,
      Accept: accept,
    });
  }

  public contentType(contentType: string): Requester {
    return this.headers({
      ...this.headers_,
      'Content-Type': contentType,
    });
  }

  public body(body: object): Requester {
    return new Requester(
      this.headers_,
      JSON.stringify(body),
      this.token,
      this.tokenType,
    );
  }

  /**
   * @method get
   * @description Sends a GET request
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  async get(url: string) {
    const res = await this.request('GET', url);
    return res;
  }

  /**
   * @method post
   * @description Sends a POST request
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  async post(url: string) {
    const res = await this.request('POST', url);
    return res;
  }

  /**
   * @method put
   * @description Sends a PUT request
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  async put(url: string) {
    const res = await this.request('PUT', url);
    return res;
  }

  /**
   * @method delete
   * @description Sends a DELETE request
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  async delete(url: string) {
    const res = await this.request('DELETE', url);
    return res;
  }

  /**
   * @method patch
   * @description Sends a PATCH request
   * @param {string} url
   * @param {object} headers
   * @returns {Promise<any>}
   */
  async patch(url: string) {
    const res = await this.request('PATCH', url);
    return res;
  }

  /**
   * @method request
   * @description Sends a request
   * @param {string} url
   * @param {string} method
   * @param {object} headers
   * @returns {Promise<any>}
   */
  async request(method: Method, url: string) {
    const res = await fetch(url, {
      method,
      headers: this.headers_ || undefined,
      body: this.body_ || undefined,
    });
    return res;
  }
}

export default Requester;
