const MarsRover = require("../MarsRover");
const Position = require("../Position");
const Direction = require("../Direction");

describe("MasRover", () => {
  it("shoule return marsRover position and diretion", () => {
    const marsRover = new MarsRover(new Position(0, 0), Direction.N);
    expect(marsRover.getState()).toEqual({
      position: {
        x: 0,
        y: 0,
      },
      direction: Direction.N,
    });
  });
});
describe("turnLeft", () => {
  it("North ->West", () => {
    const marsRover = new MarsRover(new Position(0, 0), Direction.N);
    marsRover.turnLeft();
    expect(marsRover.getState()).toEqual({
      position: {
        x: 0,
        y: 0,
      },
      direction: Direction.W,
    });
  });
  it("West  -> South", () => {
    const marsRover = new MarsRover(new Position(0, 0), Direction.W);
    marsRover.turnLeft();
    expect(marsRover.getState()).toEqual({
      position: {
        x: 0,
        y: 0,
      },
      direction: Direction.S,
    });
  });

  it("South  -> East", () => {
    const marsRover = new MarsRover(new Position(0, 0), Direction.S);
    marsRover.turnLeft();
    expect(marsRover.getState()).toEqual({
      position: {
        x: 0,
        y: 0,
      },
      direction: Direction.E,
    });
  });

  it("East  -> North", () => {
    const marsRover = new MarsRover(new Position(0, 0), Direction.E);
    marsRover.turnLeft();
    expect(marsRover.getState()).toEqual({
      position: {
        x: 0,
        y: 0,
      },
      direction: Direction.N,
    });
  });
});
