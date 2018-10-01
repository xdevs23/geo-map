declare module 'jsdom-simulant' {

  namespace e {
    function fire(el: HTMLElement, event: Event): void;
    function fire(el: HTMLElement, event: 'string', payload?: { [key: string]: any }): void;
  }

  function e(window: Window, eventName: string, payload?: { [key: string]: any }): Event;

  export = e;
}
