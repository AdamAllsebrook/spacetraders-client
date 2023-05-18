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
    index: Record<string, SystemNode>;

    nLabelNodes = 3;
    labelNodeWidth = 25;

    constructor(graph: Writable<SystemGraph>) {
        this.graph = graph;
        this.nodes = [];
        get(this.graph).forEach((node) => this.addNode(node));
        this.links = [...Array(this.nodes.length / (2 + this.nLabelNodes * 2)).keys()].map((i) => {
            return {
                source: i * 2,
                target: i * 2 + 1,
            };
        });

        this.index = Object.fromEntries(this.nodes.map((x) => [x.id, x]));
        this.simulation = d3.forceSimulation(this.nodes) //make ts happy
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

    addNode(node: SystemNode) {
        this.nodes.push({
            id: node.data.symbol + '-label',
            x: node.x,
            y: node.y,
        });
        this.nodes.push({
            id: node.data.symbol,
            x: node.x,
            y: node.y,
            fx: node.fixed ? node.x : undefined,
            fy: node.fixed ? node.y : undefined,
        });
        // Add some relative nodes to the label to account for some width
        for (let i = -this.nLabelNodes; i <= this.nLabelNodes; i++) {
            if (i === 0) continue;
            this.nodes.push({
                id: node.data.symbol + '-label-' + i,
                x: node.x + i * this.labelNodeWidth,
                y: node.y,
            });
        }
    }

    reset() {
        this.createSimulation();
    }
}
