(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const randomNum = (max) => Math.floor(Math.random() * max);

const randomEle = (array) => array[randomNum(array.length)];

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  })
};

const OPPOSITE = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up',
};


module.exports = {
  GRID_HEIGHT: 20,
  GRID_WIDTH: 20,
  SPACE_SIZE: 10,
  ANIMATION_FRAME_TIME: 20,
  COLOR: {
    exploredNode: '#828B9E',
    path: '#3588d7',
    start: '#F6D945',
    end: '#F69545'
  },
  OPPOSITE,
  randomNum,
  randomEle,
  wait
};
},{}],2:[function(require,module,exports){
const {
  GRID_HEIGHT,
  GRID_WIDTH,
  SPACE_SIZE,
  ANIMATION_FRAME_TIME,
  OPPOSITE,
  randomNum,
  randomEle,
  COLOR,
  wait
} = require('./constants');

class Graph {
  constructor(canvas, initialEdges = null, start = null, end = null) {
    this.grid = [];
    this.edges = {};
    this.ctx = canvas.getContext("2d");

    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 410, 410);

    for (let i = 0; i < GRID_HEIGHT; i++) {
      let row = [];
      for (let j = 0; j < GRID_WIDTH; j++) {
        row.push(0);
        this.edges[Graph.getNodeId(i, j)] = {
          up: false,
          down: false,
          right: false,
          left: false,
        };
      }
      this.grid.push(row);
    }

    const edges = this.generateMaze();

    edges.forEach(edge => this.setEdge(edge));


    const allNodes = Object.keys(this.edges);
    this.start = randomEle(allNodes).split(',').map(Number);
    const startIdx = allNodes.indexOf(this.start);
    allNodes.splice(startIdx, 1)
    this.end = randomEle(allNodes).split(',').map(Number);

    if (initialEdges)
      this.edges = initialEdges;

    if (start)
      this.start = start;

    if (end)
      this.end = end;

    this.draw();
    this.drawStart();
    this.drawEnd();
  }

  static getNodeId(i, j) {
    return i + "," + j;
  }

  drawNode(row, col, COLOR, edgeDirection = null) {
    row = Number(row);
    col = Number(col);
    let verticalOffset = (row * SPACE_SIZE) * 2 + SPACE_SIZE;
    let horizontalOffset = (col * SPACE_SIZE) * 2 + SPACE_SIZE;

    // draw the node
    this.ctx.fillStyle = COLOR;
    this.ctx.beginPath();
    this.ctx.fillRect(horizontalOffset, verticalOffset, SPACE_SIZE, SPACE_SIZE);
    this.ctx.stroke();

    const edgeDelta = {
      'up': { horizontalDelta: 0, verticalDelta: -SPACE_SIZE },
      'down': { horizontalDelta: 0, verticalDelta: SPACE_SIZE },
      'left': { horizontalDelta: -SPACE_SIZE, verticalDelta: 0 },
      'right': { horizontalDelta: SPACE_SIZE, verticalDelta: 0 },
    };

    if (edgeDirection !== null) {
      const delta = edgeDelta[edgeDirection];
      this.ctx.fillStyle = COLOR;
      this.ctx.beginPath();
      this.ctx.fillRect(horizontalOffset + delta.horizontalDelta, verticalOffset + delta.verticalDelta, SPACE_SIZE, SPACE_SIZE);
      this.ctx.stroke();
    }
  }

  async retrace(path, end) {
    const pos = end.split(',')
    this.drawNode(...pos, COLOR.path);
    let curr = end;

    while (path[curr].node !== null) {
      const pathObj = path[curr];
      curr = pathObj.node;
      const pos = curr.split(',');
      this.drawNode(...pos, COLOR.path, pathObj.direction);
      await wait(ANIMATION_FRAME_TIME);
    }
  }

  setEdge(edge) {
    const { src, dst, direction } = edge;
    const oppositeDirection = OPPOSITE[direction];
    this.edges[src][direction] = true;
    this.edges[dst][oppositeDirection] = true;
  }

  getNeighbors(nodeId) {
    const [row, col] = nodeId.split(',').map(Number);
    let res = []
    const directions = this.edges[Graph.getNodeId(row, col)];

    if (row > 0)
      res.push({ direction: 'up', dst: String([row - 1, col]) });

    if (row < this.grid.length - 1)
      res.push({ direction: 'down', dst: String([row + 1, col]) });

    if (col > 0)
      res.push({ direction: 'left', dst: String([row, col - 1]) });

    if (col < this.grid[0].length - 1)
      res.push({ direction: 'right', dst: String([row, col + 1]) });

    return res;
  }

  getConnectedNeighbors(nodeId) {
    const neighbors = {};
    const connectedNeighbors = [];
    this.getNeighbors(nodeId).forEach((obj) => neighbors[obj.direction] = obj.dst);
    let edges = this.edges[nodeId];
    for (let direction in edges) {
      if (edges[direction] === true) {
        connectedNeighbors.push({ direction, neighbor: neighbors[direction] });
      }
    }

    return connectedNeighbors;
  }

  draw() {
    for (let node in this.edges) {
      const pos = node.split(',');
      const directions = this.edges[node];
      const edgeDirections = Object.keys(directions).filter(dir => directions[dir]);
      edgeDirections.forEach((edgeDirection) => {
        this.drawNode(...pos, "white", edgeDirection)
      });
    }
  }

  drawStart() {
    this.drawNode(...this.start, COLOR.start);
  }

  drawEnd() {
    this.drawNode(...this.end, COLOR.end);
  }

  generateMaze() {
    const start = '0,0';
    const tree = new Set([start]);

    const getEdges = nodeId => {
      return this.getNeighbors(nodeId)
        .filter(({ dst }) => !(tree.has(dst)))
        .map(({ direction, dst }) => ({ src: nodeId, dst, direction }));
    };

    let frontierEdges = [...getEdges(start)];
    const chosenEdges = [];

    while (tree.size < GRID_WIDTH * GRID_HEIGHT) {
      const edge = randomEle(frontierEdges);
      chosenEdges.push(edge);
      tree.add(edge.dst);

      const newFrontier = [];
      for (let nodeId of tree) {
        newFrontier.push(...getEdges(nodeId));
      }

      frontierEdges = newFrontier;
    }

    return chosenEdges;
  }

  async dfs() {
    const start = this.start.join(',');
    const end = this.end.join(',');
    const stack = [{ src: null, direction: null, dst: start }];
    const stacked = new Set([start]);
    const visited = new Set([]);
    const path = {};

    while (!(visited.has(end))) {
      document.getElementById('dfs-step').innerHTML = visited.size;

      const currentObj = stack.pop();
      visited.add(currentObj.dst);
      path[currentObj.dst] = { node: currentObj.src, direction: currentObj.direction };

      const dst = currentObj.dst.split(',').map(Number);
      this.drawNode(...dst, COLOR.exploredNode, OPPOSITE[currentObj.direction]);

      this.drawStart();
      await wait(ANIMATION_FRAME_TIME);

      const neighborObjs = this.getConnectedNeighbors(currentObj.dst);
      neighborObjs.forEach(obj => {
        if (!(stacked.has(obj.neighbor))) {
          const newStackItem = { src: currentObj.dst, direction: obj.direction, dst: obj.neighbor };
          stack.push(newStackItem);
          stacked.add(obj.neighbor);
        }
      });
    }

    await this.retrace(path, end);

    this.drawStart();
    this.drawEnd();
  }

  async bfs() {
    const start = this.start.join(',');
    const end = this.end.join(',');
    const queue = [{ src: null, direction: null, dst: start }];
    const queued = new Set([start]);
    const visited = new Set([]);
    const path = {};

    while (!(visited.has(end))) {
      document.getElementById('bfs-step').innerHTML = visited.size;
      const currentObj = queue.shift();
      visited.add(currentObj.dst);
      path[currentObj.dst] = { node: currentObj.src, direction: currentObj.direction };

      const dst = currentObj.dst.split(',').map(Number);
      this.drawNode(...dst, COLOR.exploredNode, OPPOSITE[currentObj.direction]);

      this.drawStart();

      await wait(ANIMATION_FRAME_TIME);

      const neighborObjs = this.getConnectedNeighbors(currentObj.dst);
      neighborObjs.forEach(obj => {
        if (!(queued.has(obj.neighbor))) {
          const newStackItem = { src: currentObj.dst, direction: obj.direction, dst: obj.neighbor };
          queue.push(newStackItem);
          queued.add(obj.neighbor);
        }
      });
    }

    await this.retrace(path, end);

    this.drawStart();
    this.drawEnd();
  }

  async doubleBfs() {
    const a = this.start.join(',');
    const b = this.end.join(',');
    const queueA = [{ src: null, direction: null, dst: a }];
    const queueB = [{ src: null, direction: null, dst: b }];
    const queuedA = new Set([a]);
    const queuedB = new Set([b]);
    const visitedA = new Set([]);
    const visitedB = new Set([]);
    const pathA = {};
    const pathB = {};

    let middlePoint = null;
    while (!(visitedA.has(middlePoint) && visitedB.has(middlePoint))) {
      document.getElementById('double-bfs-step').innerHTML = visitedA.size + visitedB.size;
      const currentObjA = queueA.shift();
      visitedA.add(currentObjA.dst);
      if (visitedB.has(currentObjA.dst))
        middlePoint = currentObjA.dst;

      pathA[currentObjA.dst] = { node: currentObjA.src, direction: currentObjA.direction };
      const dstA = currentObjA.dst.split(',').map(Number);
      this.drawNode(...dstA, COLOR.exploredNode, OPPOSITE[currentObjA.direction]);
      const neighborObjsA = this.getConnectedNeighbors(currentObjA.dst);
      neighborObjsA.forEach(obj => {
        if (!(queuedA.has(obj.neighbor))) {
          const newStackItem = { src: currentObjA.dst, direction: obj.direction, dst: obj.neighbor };
          queueA.push(newStackItem);
          queuedA.add(obj.neighbor);
        }
      });

      const currentObjB = queueB.shift();
      visitedB.add(currentObjB.dst);
      if (visitedA.has(currentObjB.dst))
        middlePoint = currentObjB.dst;
      pathB[currentObjB.dst] = { node: currentObjB.src, direction: currentObjB.direction };
      const dstB = currentObjB.dst.split(',').map(Number);
      this.drawNode(...dstB, COLOR.exploredNode, OPPOSITE[currentObjB.direction]);
      const neighborObjsB = this.getConnectedNeighbors(currentObjB.dst);
      neighborObjsB.forEach(obj => {
        if (!(queuedB.has(obj.neighbor))) {
          const newStackItem = { src: currentObjB.dst, direction: obj.direction, dst: obj.neighbor };
          queueB.push(newStackItem);
          queuedB.add(obj.neighbor);
        }
      });

      this.drawStart();
      this.drawEnd();
      await wait(ANIMATION_FRAME_TIME);
    }

    await this.retrace(pathA, middlePoint);
    await this.retrace(pathB, middlePoint);

    this.drawStart();
    this.drawEnd();
  }

  async randoSearch() {
    const start = this.start.join(',');
    const end = this.end.join(',');
    const stack = [{ src: null, direction: null, dst: start }];
    const stacked = new Set([start]);
    const visited = new Set([]);
    const path = {};

    while (!(visited.has(end))) {
      document.getElementById('random-step').innerHTML = visited.size;

      const randomIdx = randomNum(stack.length);
      const currentObj = stack.splice(randomIdx, 1)[0];
      visited.add(currentObj.dst);
      path[currentObj.dst] = { node: currentObj.src, direction: currentObj.direction };

      const dst = currentObj.dst.split(',').map(Number);
      this.drawNode(...dst, COLOR.exploredNode, OPPOSITE[currentObj.direction]);

      this.drawStart();
      await wait(ANIMATION_FRAME_TIME);

      const neighborObjs = this.getConnectedNeighbors(currentObj.dst);
      neighborObjs.forEach(obj => {
        if (!(stacked.has(obj.neighbor))) {
          const newStackItem = { src: currentObj.dst, direction: obj.direction, dst: obj.neighbor };
          stack.push(newStackItem);
          stacked.add(obj.neighbor);
        }
      });
    }

    await this.retrace(path, end);

    this.drawStart();
    this.drawEnd();
  }
}

module.exports = Graph;
},{"./constants":1}],3:[function(require,module,exports){
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

},{"./graph":2}]},{},[3]);
