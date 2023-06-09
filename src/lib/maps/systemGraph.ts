import type { Waypoint, Ship } from "$api";


export type SystemData = Waypoint | Ship;
export type SystemNode<T = SystemData> = {
    data: T,
    x: number,
    y: number,
    orbitals: Array<SystemNode>,
    label: { x: number, y: number },
    fixed: boolean,
    parent: SystemNode | null,
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

    deleteNode(node: SystemNode) {
        this.index.delete(node.data.symbol);
        if (node.parent === null) {
            this.graph.splice(this.graph.indexOf(node), 1);
        }
        else {
            node.parent.orbitals.splice(node.parent.orbitals.indexOf(node), 1);
        }
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
            let x = this.scale.x(waypoint.x);
            let y = this.scale.y(waypoint.y);
            const parent = this.createNode({
                data: waypoint,
                x,
                y,
                orbitals: [],
                label: { x, y },
                fixed: true,
                parent: null,
            }, true);
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
                    parent,
                });
            });
            parent.orbitals = orbitals;
        });
    }

    addShips(ships: Array<Ship>) {
        let shipNodes: Array<SystemNode> = [];
        ships.forEach((ship) => {
            const parent = this.index.get(ship.nav.waypointSymbol);
            if (!parent) {
                return;
            }

            if (ship.nav.status === 'IN_TRANSIT' && ship.nav.route.departure.systemSymbol === ship.nav.route.destination.systemSymbol) {
                const dep = this.index.get(ship.nav.route.departure.symbol);
                const dest = this.index.get(ship.nav.route.destination.symbol);
                if (!dep || !dest) return;
                ship.nav.route.departure.x = dep.x;
                ship.nav.route.departure.y = dep.y;
                ship.nav.route.destination.x = dest.x;
                ship.nav.route.destination.y = dest.y;
                const x = (dep.x + dest.x) / 2;
                const y = (dep.y + dest.y) / 2;
                const node = this.createNode({
                    data: ship,
                    x,
                    y,
                    orbitals: [],
                    label: { x, y },
                    fixed: true,
                    parent: null,
                });
                this.graph.push(node);
                shipNodes.push(node);
            }
            else {
                let x = parent.x;
                let y = parent.y;
                if (parent.parent) {
                    const len = Math.sqrt((parent.x - parent.parent.x) ** 2 + (parent.y - parent.parent.y) ** 2);
                    x += (parent.x - parent.parent.x) / len * 10;
                    y += (parent.y - parent.parent.y) / len * 10;
                }
                const node = this.createNode({
                    data: ship,
                    x,
                    y,
                    orbitals: [],
                    label: { x, y },
                    fixed: false,
                    parent,
                });
                parent.orbitals.push(node);
                shipNodes.push(node);
            }
        });
        return shipNodes;
    }

    updateShip(ship: Ship) {
        const node = this.index.get(ship.symbol);
        if (!node) return;
        this.deleteNode(node);
        const [shipNode] = this.addShips([ship]);
        return shipNode;

    }

    forEach(callback: (node: SystemNode) => void) {
        this.index.forEach(callback);
    }
}

