export class Block {
  public type: BlockType; // integer 0 - 6

  public constructor(type: BlockType) {
    this.type = type;
  }
}

export enum BlockType {
  I,
  O,
  T,
  J,
  L,
  S,
  Z
}

// Positive y is down
// Positive x is right
export function blockTypeToCoords(type: BlockType): Array<[number, number]> {
  switch (type) {
    case BlockType.I:
      return [[0, -1], [0, 0], [0, 1], [0, 2]];
    case BlockType.O:
      return [[0, 0], [0, 1], [1, 1], [1, 0]];
    case BlockType.T:
      return [[-1, 0], [0, 0], [1, 0], [0, 1]];
    case BlockType.J:
      return [[0, -1], [0, 0], [0, 1], [-1, 1]];
    case BlockType.L:
      return [[0, -1], [0, 0], [0, 1], [1, 1]];
    case BlockType.S:
      return [[1, 0], [0, 0], [0, 1], [-1, 1]];
    case BlockType.Z:
      return [[-1, 0], [0, 0], [0, 1], [1, 1]];
  }
}
