import type { Waypoint as TWaypoint } from "$api";

export type GraphWaypoint = { waypoint: TWaypoint, x: number, y: number, orbitals: Array<GraphWaypoint>, label: { x: number, y: number } };

const orbitalDistance = 24;
const orbitalTheta = Math.PI / 3;
const orbitalThetaOffset = 0;

export function systemGraph(waypoints: Array<TWaypoint>, scale: any): Array<GraphWaypoint> {
    const symbolIndex = Object.fromEntries(waypoints.map((waypoint) => [waypoint.symbol, waypoint]));
    const isOrbital = Object.fromEntries(waypoints.map((waypoint) => [waypoint.symbol, false]));
    waypoints.forEach((waypoint) => {
        waypoint.orbitals.forEach((orbital) => {
            isOrbital[orbital.symbol] = true;
        });
    });
    let renderData: Array<GraphWaypoint> = [];
    waypoints.forEach((waypoint) => {
        if (isOrbital[waypoint.symbol]) {
            return;
        }
        const orbitals = waypoint.orbitals.map((orbital, i) => {
            let x = scale.x(waypoint.x) + orbitalDistance * Math.cos(orbitalTheta * i + orbitalThetaOffset);
            let y = scale.y(waypoint.y) + orbitalDistance * Math.sin(orbitalTheta * i + orbitalThetaOffset);
            return {
                waypoint: symbolIndex[orbital.symbol],
                x,
                y,
                orbitals: [],
                label: { x, y },
            };
        });
        let x = scale.x(waypoint.x);
        let y = scale.y(waypoint.y);
        renderData.push({
            waypoint,
            x,
            y,
            orbitals,
            label: { x, y },
        });
    });
    return renderData;
}
