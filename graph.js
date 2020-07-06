const GRID_HEIGHT = 20;
const GRID_WIDTH = 20;
const SPACE_SIZE = 15; // 15 pixels

const randomNum = (max) => Math.floor(Math.random() * max);

const randomEle = (array) => array[randomNum(array.length)];

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  })
};


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.fillStyle = "black";
ctx.fillRect(0, 0, 600, 600);

class Graph {
  constructor(height, width) {
    this.grid = [];
    this.edges = {};
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
    edges.forEach((edge) => {
      const { src, dst, direction } = edge;
      if (direction === 'up') {
        this.edges[src].up = true;
        this.edges[dst].down = true;
      }

      if (direction === 'down') {
        this.edges[src].down = true;
        this.edges[dst].up = true;
      }

      if (direction === 'right') {
        this.edges[src].right = true;
        this.edges[dst].left = true;
      }

      if (direction === 'left') {
        this.edges[src].left = true;
        this.edges[dst].right = true;
      }
    })

    const allNodes = Object.keys(this.edges);
    this.start = randomEle(allNodes).split(',').map(Number);
    const startIdx = allNodes.indexOf(this.start);
    allNodes.splice(startIdx, 1)
    this.end = randomEle(allNodes).split(',').map(Number);
  }

  static getNodeId(i, j) {
    return i + "," + j;
  }

  static drawNode(row, col, color, edge = null) {
    row = Number(row);
    col = Number(col);
    let verticalOffset = (row * SPACE_SIZE) * 2;
    let horizontalOffset = (col * SPACE_SIZE) * 2;

    // draw the node
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(horizontalOffset, verticalOffset, SPACE_SIZE, SPACE_SIZE);
    ctx.stroke();

    // draw the edge
    if (edge !== null) {
      if (edge === 'up') {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(horizontalOffset, verticalOffset - SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();
      }
      if (edge === 'down') {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(horizontalOffset, verticalOffset + SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();
      }
      if (edge === 'left') {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(horizontalOffset - SPACE_SIZE, verticalOffset, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();
      }
      if (edge === 'right') {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(horizontalOffset + SPACE_SIZE, verticalOffset, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();
      }
    }
  }

  static retrace(path, end) {
    const nodes = [];
    let curr = end;

    while (path[curr] !== null) {
      nodes.push(curr);
      curr = path[curr];
    }

    return nodes;
  }

  getNeighbors(nodeId) {
    const [row, col] = nodeId.split(',').map(Number);
    let res = []
    const directions = this.edges[Graph.getNodeId(row, col)];
    if (row > 0) {
      res.push({ direction: 'up', dst: String([row - 1, col]) })
    }

    if (row < this.grid.length - 1) {
      res.push({ direction: 'down', dst: String([row + 1, col]) })
    }

    if (col > 0) {
      res.push({ direction: 'left', dst: String([row, col - 1]) })
    }

    if (col < this.grid[0].length - 1) {
      res.push({ direction: 'right', dst: String([row, col + 1]) })
    }

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
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        let verticalOffset = (i * SPACE_SIZE) * 2;
        let horizontalOffset = (j * SPACE_SIZE) * 2;

        // draw node
        Graph.drawNode(i, j, 'white');

        // draw its edges
        let neighbors = this.edges[Graph.getNodeId(i, j)];

        // up
        ctx.beginPath();
        ctx.fillStyle = neighbors.up ? "white" : "black";
        ctx.fillRect(horizontalOffset, verticalOffset - SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();

        // down
        ctx.beginPath();
        ctx.fillStyle = neighbors.down ? "white" : "black";
        ctx.fillRect(horizontalOffset, verticalOffset + SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();

        // left 
        ctx.beginPath();
        ctx.fillStyle = neighbors.left ? "white" : "black";
        ctx.fillRect(horizontalOffset - SPACE_SIZE, verticalOffset, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();

        // right 
        ctx.beginPath();
        ctx.fillStyle = neighbors.right ? "white" : "black";
        ctx.fillRect(horizontalOffset + SPACE_SIZE, verticalOffset, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();
      }
    }
  }

  generateMaze() {
    const start = '0,0';
    const tree = new Set([start]);

    const getEdges = nodeId => {
      return this.getNeighbors(nodeId)
        .filter(data => {
          const { direction, dst } = data;
          return !(tree.has(dst));
        })
        .map(data => {
          const { direction, dst } = data;
          return {
            src: nodeId,
            dst: dst,
            direction
          }
        });
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
      const currentObj = stack.pop();

      // draw this node and it's leading edge
      const dst = currentObj.dst.split(',').map(Number);

      const opposite = {
        left: 'right',
        right: 'left',
        up: 'down',
        down: 'up',
      };

      Graph.drawNode(...dst, 'purple', opposite[currentObj.direction]);
      await wait(10);

      path[currentObj.dst] = currentObj.src;
      visited.add(currentObj.dst);
      const neighborObjs = this.getConnectedNeighbors(currentObj.dst);
      neighborObjs.forEach((obj) => {
        if (!(stacked.has(obj.neighbor))) {
          const newStackItem = { src: currentObj.dst, direction: obj.direction, dst: obj.neighbor };
          stack.push(newStackItem);
          stacked.add(obj.neighbor);
        }
      });
    }

    // draw the winning path from start to end
    const winningPath = Graph.retrace(path, end).map((pos) => pos.split(','));;
    winningPath.forEach((pos) => Graph.drawNode(...pos, 'pink'));

    // draw the start and end nodes
    Graph.drawNode(...this.start, "blue");
    Graph.drawNode(...this.end, "red");
  }
}

const g = new Graph();

g.draw()
g.dfs();
