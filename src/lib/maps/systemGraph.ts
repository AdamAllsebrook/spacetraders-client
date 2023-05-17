import type { Waypoint, Ship } from "$api";


export type SystemData = Waypoint | Ship;
export type SystemNode<T = SystemData> = {
    data: T,
    x: number,
    y: number,
    orbitals: Array<SystemNode>,
    label: { x: number, y: number },
    fixed: boolean
};


export class SystemGraph {
    orbitalDistance = 40;
    orbitalTheta = Math.PI / 3;
    orbitalThetaOffset = 0;

    scale: { x: any, y: any }
    graph: Array<SystemNode>;
    index: Map<string, SystemNode>;

    constructor(scale: any) {
        this.scale = scale;
        this.graph = [];
        this.index = new Map();
    }

    createNode(node: SystemNode, push?: boolean) {
        this.index.set(node.data.symbol, node);
        if (push) {
            this.graph.push(node);
        }
        return node;
    }

    addWaypoints(waypoints: Array<Waypoint>) {
        const symbolIndex = Object.fromEntries(waypoints.map((waypoint) => [waypoint.symbol, waypoint]));
        const isOrbital = Object.fromEntries(waypoints.map((waypoint) => [waypoint.symbol, false]));
        waypoints.forEach((waypoint) => {
            waypoint.orbitals.forEach((orbital) => {
                isOrbital[orbital.symbol] = true;
            });
        });
        waypoints.forEach((waypoint) => {
            if (isOrbital[waypoint.symbol]) {
                return;
            }
            const orbitals = waypoint.orbitals.map((orbital, i) => {
                let x = this.scale.x(waypoint.x) + this.orbitalDistance * Math.cos(this.orbitalTheta * i + this.orbitalThetaOffset);
                let y = this.scale.y(waypoint.y) + this.orbitalDistance * Math.sin(this.orbitalTheta * i + this.orbitalThetaOffset);
                return this.createNode({
                    data: symbolIndex[orbital.symbol],
                    x,
                    y,
                    orbitals: [],
                    label: { x, y },
                    fixed: true,
                });
            });
            let x = this.scale.x(waypoint.x);
            let y = this.scale.y(waypoint.y);
            this.createNode({
                data: waypoint,
                x,
                y,
                orbitals,
                label: { x, y },
                fixed: true,
            }, true);
        });
    }

    addShips(ships: Array<Ship>) {
        ships.forEach((ship) => {
            const parent = this.index.get(ship.nav.waypointSymbol);
            if (!parent) {
                return;
            }
            const x = parent.x;// + this.orbitalDistance;
            const y = parent.y;// + this.orbitalDistance;
            const node = this.createNode({
                data: ship,
                x: x,
                y: y,
                orbitals: [],
                label: { x: x, y: y },
                fixed: false,
            });
            parent.orbitals.push(node);
        });
    }

    forEach(callback: (node: SystemNode) => void) {
        this.index.forEach(callback);
    }
}

