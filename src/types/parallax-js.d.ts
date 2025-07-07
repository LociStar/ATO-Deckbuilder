declare module 'parallax-js' {
    export default class Parallax {
        constructor(element: HTMLElement, options?: any);
        enable(): void;
        disable(): void;
        destroy(): void;
    }
}
