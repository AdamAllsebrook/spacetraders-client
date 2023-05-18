import type { SvelteComponent } from "svelte";


export class Popups {
    container: HTMLElement | null = null;
    popups: Map<string, { component: any, props: any }>;

    constructor() {
        this.popups = new Map();
    }

    setContainer(container: HTMLElement) {
        this.container = container;
    }

    add(name: string, component: any, props: any) {
        // if (this.container === null) return;
        // const comp = new component({
        //     target: this.container,
        //     props: props,
        // });
        this.popups.set(name, { component, props });
    }

    remove(name: string) {
        this.popups.delete(name);
    }

    clear() {
        this.popups.clear();
    }
}
