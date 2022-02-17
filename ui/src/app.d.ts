/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces

declare function username(): string;

declare class WebUI {
  static Call: (event: string, ...args: any[]) => any

}

interface Location {
  ancestorOrigins: string[]
}