declare module 'supertest' {
  interface Response {
    status: number;
    body: any;
    headers: Record<string, string>;
    text: string;
    type: string;
    get(field: string): string;
  }

  interface Test extends Promise<Response> {
    set(field: string, value: string): this;
    set(headers: Record<string, string>): this;
    send(data: any): this;
    expect(status: number): this;
    expect(field: string, value: string | RegExp): this;
    query(params: Record<string, any>): this;
    attach(field: string, file: string | Buffer, options?: any): this;
    field(name: string, value: string): this;
    auth(user: string, pass: string, options?: any): this;
    type(type: string): this;
    accept(type: string): this;
    end(callback?: (err: Error | null, res: Response) => void): void;
  }

  interface SuperTest {
    get(url: string): Test;
    post(url: string): Test;
    put(url: string): Test;
    patch(url: string): Test;
    delete(url: string): Test;
    head(url: string): Test;
    options(url: string): Test;
  }

  // supertest is a callable function: request(app) => SuperTest
  function supertest(app: any): SuperTest;
  namespace supertest {}
  export = supertest;
}
