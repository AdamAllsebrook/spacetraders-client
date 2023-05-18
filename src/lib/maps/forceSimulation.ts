import * as d3 from 'd3';
import { type Writable, get } from 'svelte/store';
import type { SystemGraph, SystemNode } from './systemGraph';

type ForceNode = {
    id: any;
    x: number;
    y: number;
    fx?: number;
    fy?: number;
};


export class ForceSimulation {
    simulation: d3.Simulation<ForceNode, undefined>;
    graph: Writable<SystemGraph>;
    nodes: Array<ForceNode>;
    links: Array<{ source: number; target: number }>;
    index: Record<string, ForceNode>;

    nLabelNodes = 3;
    labelNodeWidth = 25;

    constructor() {
        this.simulation = d3.forceSimulation()
        this.graph = {} as Writable<SystemGraph>;
        this.nodes = [];
        this.links = [];
        this.index = {};
    }

    clear() {
        this.simulation = d3.forceSimulation()
        this.graph = {} as Writable<SystemGraph>;
        this.nodes = [];
        this.links = [];
        this.index = {};
    }


    init(graph: Writable<SystemGraph>) {
        this.clear();
        this.graph = graph;
        get(this.graph).forEach((node) => this.addNode(node));
        this.createSimulation();
    }

    createSimulation() {
        this.simulation = d3
            .forceSimulation(this.nodes)
            .force('charge', d3.forceManyBody().strength(-70).distanceMax(100).distanceMin(5))
            .force('collision', d3.forceCollide().radius(1))
            .force('link', d3.forceLink(this.links).distance(40))
            .alphaDecay(0.1)
            .on('tick', () => this.simulationTick());
    }

    simulationTick() {
        this.graph.update((graph) => {
            graph.forEach((node) => {
                node.x = this.index[node.data.symbol].x;
                node.y = this.index[node.data.symbol].y;
                node.label.x = this.index[node.data.symbol + '-label'].x;
                node.label.y = this.index[node.data.symbol + '-label'].y;

                for (let i = -this.nLabelNodes; i <= this.nLabelNodes; i++) {
                    if (i === 0) continue;
                    this.index[node.data.symbol + '-label-' + i].x = node.label.x + i * this.labelNodeWidth;
                    this.index[node.data.symbol + '-label-' + i].y = node.label.y;
                }
            });
            return graph;
        });
    }

    nodeClusterSize() {
        return 2 + this.nLabelNodes * 2;
    }

    addNode(node: SystemNode) {
        this.links.push({
            source: this.nodes.length + 1,
            target: this.nodes.length,
        });
        this.addNodePart({
            id: node.data.symbol,
            x: node.x,
            y: node.y,
            fx: node.fixed ? node.x : undefined,
            fy: node.fixed ? node.y : undefined,
        });
        this.addNodePart({
            id: node.data.symbol + '-label',
            x: node.x,
            y: node.y,
        });
        // Add some relative nodes to the label to account for some width
        for (let i = -this.nLabelNodes; i <= this.nLabelNodes; i++) {
            if (i === 0) continue;
            this.addNodePart({
                id: node.data.symbol + '-label-' + i,
                x: node.x + i * this.labelNodeWidth,
                y: node.y,
            });
        }
    }

    private addNodePart(node: ForceNode) {
        this.nodes.push(node);
        this.index[node.id] = node;
    }

    removeNode(node: SystemNode) {
        if (this.index[node.data.symbol] === undefined) return;
        const index = this.nodes.findIndex((x) => x.id === node.data.symbol);
        this.links.splice(index / this.nodeClusterSize(), 1);
        this.nodes.splice(index, this.nodeClusterSize());
    }

    updateNode(node: SystemNode) {
        if (this.index[node.data.symbol] === undefined) return;
        this.removeNode(node);
        this.addNode(node);
        this.createSimulation();
    }

    reset() {
        this.createSimulation();
    }
}
