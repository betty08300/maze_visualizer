const Graph = require('./graph');

const runSimulation = () => {
  const g1 = new Graph(document.getElementById("canvas1"));
  const g2 = new Graph(document.getElementById("canvas2"), g1.edges, g1.start, g1.end);
  const g3 = new Graph(document.getElementById("canvas3"), g1.edges, g1.start, g1.end);
  const g4 = new Graph(document.getElementById("canvas4"), g1.edges, g1.start, g1.end);

  g1.dfs();
  g2.bfs();
  g3.doubleBfs();
  g4.randoSearch();
};

const getDfsText = () => {
  document.getElementById('description').innerText = "Implemented using a stack. A path is explored fully until a dead-end is reached, at which point a new path direction is chosen to explore."
}

const getBfsText = () => {
  document.getElementById('description').innerText = "Implemented using a queue. Paths in all directions take turns being incrementally explored."
}

const getBidirctionText = () => {
  document.getElementById('description').innerText = "Implemented using two queues. A Breadth-First search is conducted from both the start and the end. The two explored regions are guaranteed to meet the middle, meaning a path has been found."
}

const getRandomText = () => {
  document.getElementById('description').innerText = "Unexplored edges are randomly chosen until the target is found. Because there is guaranteed to exist at least one path between two nodes in a spanning tree, the algorithm will eventually finish."
}



document.body.style.backgroundImage = "url('maze_background.jpg')";

document.getElementById('run-maze').addEventListener('click', runSimulation);
document.getElementById('dfs-button').addEventListener('click', getDfsText)
document.getElementById('bfs-button').addEventListener('click', getBfsText)
document.getElementById('double-bfs-button').addEventListener('click', getBidirctionText)
document.getElementById('random-button').addEventListener('click', getRandomText)

runSimulation();
