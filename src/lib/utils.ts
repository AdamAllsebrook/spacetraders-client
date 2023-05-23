import type { Writable } from "svelte/store";

export const stripSystem = (system: string) => {
    return system.split('-').slice(0, 2).join('-');
}

export const stripWaypoint = (system: string) => {
    return system.split('-').slice(-1);
}

export type Box = {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export function animateStore(window: Window, store: Writable<number>, start: number, end: number, startTime: number, endTime: number, callback?: () => void) {
    let done = false;
    function step() {
        const progress = (Date.now() - startTime) / (endTime - startTime);
        if (progress >= 1 || progress < 0) {
            if (callback && !done) callback();
            done = true;
            return;
        }
        else {
            store.set(start + (end - start) * progress);
            window.requestAnimationFrame(step);
        }
    }
    store.set(start);
    window.requestAnimationFrame(step);
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
