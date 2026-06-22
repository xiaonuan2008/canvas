declare module 'mitt' {
  type EventType = string | symbol;
  type EventHandler = (...args: any[]) => void;
  interface Emitter {
    on(event: EventType, handler: EventHandler): void;
    off(event: EventType, handler: EventHandler): void;
    emit(event: EventType, ...args: any[]): void;
  }
  function mitt(): Emitter;
  export default mitt;
}

declare module 'hotkeys-js' {
  function hotkeys(keys: string, callback: (event: KeyboardEvent) => void): void;
  namespace hotkeys {
    function unbind(keys?: string): void;
  }
  export default hotkeys;
}
