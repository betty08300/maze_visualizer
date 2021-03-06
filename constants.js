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