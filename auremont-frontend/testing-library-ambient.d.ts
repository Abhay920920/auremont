// testing-library-ambient.d.ts
// Provides ambient module declarations for @testing-library packages
// so the TypeScript IDE resolves imports before `npm install` completes.
// Once installed, the real @types packages take precedence automatically.

declare module '@testing-library/react' {
  import { ReactElement, ReactNode } from 'react';

  export interface RenderResult {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: HTMLElement | HTMLElement[]) => void;
    unmount: () => void;
    rerender: (ui: ReactElement) => void;
    asFragment: () => DocumentFragment;
    getByText: (text: string | RegExp, options?: any) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: any) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    getByTestId: (testId: string | RegExp, options?: any) => HTMLElement;
    getByDisplayValue: (value: string | RegExp, options?: any) => HTMLElement;
    queryByText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByLabelText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByTestId: (testId: string | RegExp, options?: any) => HTMLElement | null;
    findByText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByLabelText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByRole: (role: string, options?: any) => Promise<HTMLElement>;
    getAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByRole: (role: string, options?: any) => HTMLElement[];
  }

  export interface RenderOptions {
    wrapper?: React.ComponentType<{ children: ReactNode }>;
    baseElement?: HTMLElement;
    hydrate?: boolean;
  }

  export function render(ui: ReactElement, options?: RenderOptions): RenderResult;
  export function renderHook<TResult>(
    renderFn: (props?: any) => TResult,
    options?: any
  ): {
    result: { current: TResult };
    rerender: (newProps?: any) => void;
    unmount: () => void;
  };

  export function act(callback: () => void | Promise<void>): Promise<void>;
  export function waitFor<T>(callback: () => T | Promise<T>, options?: any): Promise<T>;
  export function waitForElementToBeRemoved(callback: () => any, options?: any): Promise<void>;
  export function cleanup(): void;

  export const screen: {
    getByText: (text: string | RegExp, options?: any) => HTMLElement;
    getByLabelText: (text: string | RegExp, options?: any) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp, options?: any) => HTMLElement;
    getByRole: (role: string, options?: any) => HTMLElement;
    getByTestId: (testId: string | RegExp, options?: any) => HTMLElement;
    getByDisplayValue: (value: string | RegExp, options?: any) => HTMLElement;
    queryByText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByLabelText: (text: string | RegExp, options?: any) => HTMLElement | null;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByTestId: (testId: string | RegExp, options?: any) => HTMLElement | null;
    findByText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByLabelText: (text: string | RegExp, options?: any) => Promise<HTMLElement>;
    findByRole: (role: string, options?: any) => Promise<HTMLElement>;
    getAllByText: (text: string | RegExp, options?: any) => HTMLElement[];
    getAllByRole: (role: string, options?: any) => HTMLElement[];
    debug: (element?: HTMLElement) => void;
  };

  export const fireEvent: {
    click: (element: HTMLElement, eventInit?: MouseEventInit) => boolean;
    change: (element: HTMLElement, eventInit?: { target: { value: string } }) => boolean;
    focus: (element: HTMLElement, eventInit?: FocusEventInit) => boolean;
    blur: (element: HTMLElement, eventInit?: FocusEventInit) => boolean;
    submit: (element: HTMLElement, eventInit?: Event) => boolean;
    keyDown: (element: HTMLElement, eventInit?: KeyboardEventInit) => boolean;
    keyUp: (element: HTMLElement, eventInit?: KeyboardEventInit) => boolean;
    mouseOver: (element: HTMLElement, eventInit?: MouseEventInit) => boolean;
    mouseOut: (element: HTMLElement, eventInit?: MouseEventInit) => boolean;
    [key: string]: (element: HTMLElement, eventInit?: any) => boolean;
  };
}

declare module '@testing-library/jest-dom' {
  // Augments jest.Matchers with DOM matchers
  export {};
}

declare module '@testing-library/user-event' {
  const userEvent: {
    setup: (options?: any) => {
      click: (element: HTMLElement) => Promise<void>;
      type: (element: HTMLElement, text: string) => Promise<void>;
      clear: (element: HTMLElement) => Promise<void>;
      selectOptions: (element: HTMLElement, values: string | string[]) => Promise<void>;
      keyboard: (text: string) => Promise<void>;
      tab: () => Promise<void>;
    };
    click: (element: HTMLElement) => Promise<void>;
    type: (element: HTMLElement, text: string) => Promise<void>;
    clear: (element: HTMLElement) => Promise<void>;
  };
  export default userEvent;
}
