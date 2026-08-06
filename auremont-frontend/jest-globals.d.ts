// jest-globals.d.ts
// Provides ambient Jest type declarations so the TypeScript IDE
// resolves test globals (describe, it, expect, jest, etc.)
// without requiring @types/jest to be present in node_modules.
// Once you run `npm install`, @types/jest will take over automatically.

declare function describe(name: string, fn: () => void): void;
declare namespace describe {
  function only(name: string, fn: () => void): void;
  function skip(name: string, fn: () => void): void;
  function each(table: any[]): (name: string, fn: (...args: any[]) => any) => void;
}

declare function it(name: string, fn?: () => void | Promise<void>, timeout?: number): void;
declare namespace it {
  function only(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function skip(name: string, fn?: () => void | Promise<void>): void;
  function each(table: any[]): (name: string, fn: (...args: any[]) => any, timeout?: number) => void;
}

declare function test(name: string, fn?: () => void | Promise<void>, timeout?: number): void;
declare namespace test {
  function only(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function skip(name: string, fn?: () => void | Promise<void>): void;
}

declare function beforeEach(fn: () => void | Promise<void>, timeout?: number): void;
declare function afterEach(fn: () => void | Promise<void>, timeout?: number): void;
declare function beforeAll(fn: () => void | Promise<void>, timeout?: number): void;
declare function afterAll(fn: () => void | Promise<void>, timeout?: number): void;

declare function expect(value: any): jest.Matchers<any>;

declare namespace jest {
  interface Matchers<R> {
    toBe(value: any): R;
    toEqual(value: any): R;
    toStrictEqual(value: any): R;
    toBeDefined(): R;
    toBeUndefined(): R;
    toBeNull(): R;
    toBeTruthy(): R;
    toBeFalsy(): R;
    toBeGreaterThan(value: number): R;
    toBeLessThan(value: number): R;
    toContain(value: any): R;
    toHaveLength(value: number): R;
    toHaveProperty(path: string, value?: any): R;
    toHaveValue(value: any): R;
    toBeInstanceOf(cls: any): R;
    toThrow(error?: any): R;
    rejects: Matchers<Promise<R>>;
    resolves: Matchers<Promise<R>>;
    not: Matchers<R>;
    toHaveBeenCalled(): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toHaveBeenCalledTimes(n: number): R;
    toMatchObject(obj: any): R;
    toMatchSnapshot(): R;
    toMatch(pattern: string | RegExp): R;
    toBeCloseTo(number: number, numDigits?: number): R;
  }

  function fn(): jest.Mock;
  function fn<T, Y extends any[]>(implementation?: (...args: Y) => T): jest.Mock<T, Y>;
  function spyOn(object: any, method: string): jest.SpyInstance;
  function mock(moduleName: string, factory?: () => any): typeof jest;
  function clearAllMocks(): void;
  function resetAllMocks(): void;
  function restoreAllMocks(): void;
  function useFakeTimers(): typeof jest;
  function useRealTimers(): typeof jest;
  function runAllTimers(): void;
  function advanceTimersByTime(msToRun: number): void;

  interface Mock<T = any, Y extends any[] = any[]> {
    (...args: Y): T;
    mockReturnValue(value: T): this;
    mockReturnValueOnce(value: T): this;
    mockResolvedValue(value: T): this;
    mockResolvedValueOnce(value: T): this;
    mockRejectedValue(value: any): this;
    mockRejectedValueOnce(value: any): this;
    mockImplementation(fn: (...args: Y) => T): this;
    mockImplementationOnce(fn: (...args: Y) => T): this;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): void;
    mock: {
      calls: Y[];
      results: Array<{ type: 'return' | 'throw'; value: T }>;
      instances: any[];
    };
  }

  interface SpyInstance<T = any, Y extends any[] = any[]> extends Mock<T, Y> {}
}
