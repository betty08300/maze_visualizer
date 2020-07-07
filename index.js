const Graph = require('./graph');

const g1 = new Graph(document.getElementById("canvas1"));
const g2 = new Graph(document.getElementById("canvas2"), g1.edges, g1.start, g1.end);

g1.dfs();
g2.bfs();
