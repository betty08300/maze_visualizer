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

const getInnerText = () => {
  document.getElementById('dfs-description').innerText
}
document.body.style.backgroundImage = "url('maze_background.jpg')";
document.getElementById('run-maze').addEventListener('click', runSimulation);
document.getElementById('dfs-button').addEventListener('click', getInnerText)
runSimulation();
