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
