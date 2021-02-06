const Direction = require("./Direction");
const map = {
  [Direction.N]: {
    left: Direction.W,
  },

  [Direction.W]: {
    left: Direction.S,
  },

  [Direction.S]: {
    left: Direction.E,
  },

  [Direction.E]: {
    left: Direction.N,
  },
};

exports.turnLeft = (direction) => {
  return map[direction].left;
};
