const { turnLeft } = require("./DirectionMap");

module.exports = class MarsRover {
  constructor(position, direction) {
    this.position = position;
    this.direction = direction;
  }

  getState() {
    // 伪实现
    return {
      position: this.position,
      direction: this.direction,
    };
  }
  turnLeft() {
    this.direction = turnLeft(this.direction);
  }
};
