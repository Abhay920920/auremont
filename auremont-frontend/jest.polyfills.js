const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web');

// Preserve Node 18+ native Web Fetch API globals before JSDOM window initialization
const nativeFetch = global.fetch;
const nativeHeaders = global.Headers;
const nativeFormData = global.FormData;
const nativeRequest = global.Request;
const nativeResponse = global.Response;

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, writable: true, configurable: true },
  TextEncoder: { value: TextEncoder, writable: true, configurable: true },
  ReadableStream: { value: ReadableStream, writable: true, configurable: true },
  WritableStream: { value: WritableStream, writable: true, configurable: true },
  TransformStream: { value: TransformStream, writable: true, configurable: true },
});

if (nativeFetch) {
  Object.defineProperties(globalThis, {
    fetch: { value: nativeFetch, writable: true, configurable: true },
    Headers: { value: nativeHeaders, writable: true, configurable: true },
    FormData: { value: nativeFormData, writable: true, configurable: true },
    Request: { value: nativeRequest, writable: true, configurable: true },
    Response: { value: nativeResponse, writable: true, configurable: true },
  });
} else {
  require('whatwg-fetch');
}

if (typeof globalThis.Blob === 'undefined') {
  const { Blob } = require('node:buffer');
  globalThis.Blob = Blob;
}
if (typeof globalThis.File === 'undefined') {
  const { File } = require('node:buffer');
  globalThis.File = File;
}

if (typeof globalThis.BroadcastChannel === 'undefined') {
  try {
    const { BroadcastChannel } = require('node:worker_threads');
    if (BroadcastChannel) {
      globalThis.BroadcastChannel = BroadcastChannel;
    }
  } catch (e) {
    globalThis.BroadcastChannel = class BroadcastChannel {
      constructor(name) { this.name = name; }
      postMessage() { /* noop */ }
      close() { /* noop */ }
      addEventListener() { /* noop */ }
      removeEventListener() { /* noop */ }
    };
  }
}
