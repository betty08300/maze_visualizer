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
  document.getElementById('description').innerText = "depth-First traversal will continually travel deeper into a tree before switching branches. By given a node, we must visit all of it's descendants before visiting it's sibling. The strategy is to use an array as a stack, and use push to add to the top of the stack and pop to remove the top"
}

const getBfsText = () => {
  document.getElementById('description').innerText = "Breadth-First traversal will visit all nodes across a level, before moving to the next level, which means we travel as much as we can before going deeper into the tree. The strategy is to use as array as queue, and use shift to remove the front of the queue and push will add to the back of the queue"
}

const getBidirctionText = () => {
  document.getElementById('description').innerText = "Double Breadth-First Search combine forward search which start vertex toward goal vertex and backward search form goal vertex toward start vertex. The strategy is to find the middle point between start and end, and to create two queues and the search terminates when find the same node in both queues"
}

const getRandomText = () => {
  document.getElementById('description').innerText = "A type of local random search, where every iteration is choosing a random node to travel. To create an array as a stack, and a random node on every iteration to the top of the stack and pop to remove the top"
}



document.body.style.backgroundImage = "url('maze_background.jpg')";

document.getElementById('run-maze').addEventListener('click', runSimulation);
document.getElementById('dfs-button').addEventListener('click', getDfsText)
document.getElementById('bfs-button').addEventListener('click', getBfsText)
document.getElementById('double-bfs-button').addEventListener('click', getBidirctionText)
document.getElementById('random-button').addEventListener('click', getRandomText)

runSimulation();
