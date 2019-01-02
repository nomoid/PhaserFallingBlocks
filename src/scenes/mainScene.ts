import 'phaser';
import { Block, randomBlockType } from '../block';
import { screenWidth, screenHeight } from '../game';
import { Grid, allCoords, gridWidth, gridHeight } from '../grid';

import phaserPng from '../assets/phaser.png';

type Graphics = Phaser.GameObjects.Graphics;

// Size of a grid space
const worldScale = 25;
// Size of line between blocks
const gridLineWidth = 2;
// Initial number of ms between updates
const initialUpdateDelay = 500;
const initialInputDelay = 100;
const inputDelayRatio = 2;
// 0, 0 of grid is top left corner
let worldOffsetX: number;
let worldOffsetY: number;

export class MainScene extends Phaser.Scene {
  // Properties set during create
  private graphics!: Graphics;
  private block!: Block;
  private grid!: Grid;
  private keyLeft!: Phaser.Input.Keyboard.Key;
  private keyRight!: Phaser.Input.Keyboard.Key;
  private keyUp!: Phaser.Input.Keyboard.Key;
  private keyDown!: Phaser.Input.Keyboard.Key;

  // Update timer counts up in ms
  // When update time reaches update delay, it subtracts off the delay and an
  // update occurs
  private updateTimer: number = 0;
  private updateDelay: number = initialUpdateDelay;
  // Input timer counts down in ms
  // When a keyboard input occurs, it check if the input timer is zero. If it
  // is, the input occurs and the input timer is set to the input delay. The
  // last input timer is used for repeating key delay.
  private inputTimer: number = 0;
  private inputDelay: number = initialInputDelay;

  constructor() {
    super({ key: 'MainScene' });

    worldOffsetX = screenWidth / 2 - (worldScale * gridWidth) / 2;
    worldOffsetY = screenHeight / 2 - (worldScale * gridHeight) / 2;
  }

  public preload() {
    this.load.image('phaser', phaserPng);
  }

  public create() {
    this.graphics = this.add.graphics();

    this.makeNewBlock();
    this.grid = new Grid();

    this.input.on('pointerdown', (event: any) => {
      this.makeNewBlock();
    });

    const keyCodes = Phaser.Input.Keyboard.KeyCodes;
    this.keyLeft = this.input.keyboard.addKey(keyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(keyCodes.RIGHT);
    this.keyUp = this.input.keyboard.addKey(keyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(keyCodes.DOWN);
  }

  public update(time: number, delta: number) {
    this.render();
    this.updateInput(delta);
    this.updateBlock(delta);
  }

  private makeNewBlock() {
    this.block = new Block(randomBlockType(), gridWidth / 2);
  }

  private render() {
    const graphics = this.graphics;
    graphics.clear();
    this.renderGrid();
    this.renderBlock();
  }

  private renderBlock() {
    this.block.getFilled().forEach(renderSpaces(this.graphics, 0x0000ff));
  }

  private renderGrid() {
    // Render grid lines - do this by rendering complete area as a rectangle
    // and then rendering empty grid spaces
    this.renderGridBackground();
    this.grid.getEmpty().forEach(renderSpaces(this.graphics, 0x000000));
    // Render filled grid spaces
    this.grid.getFilled().forEach(renderSpaces(this.graphics, 0x7f7fff));
  }

  private renderGridBackground() {
    const graphics = this.graphics;
    const [startX, startY] = gridToWorldPos(0, 0);
    const [endX, endY] = gridToWorldPos(gridWidth, gridHeight);
    const width = endX - startX;
    const height = endY - startY;
    graphics.fillStyle(0x3f3f3f, 1);
    graphics.fillRect(startX, startY, width, height);
  }

  private updateInput(delta: number) {
    this.inputTimer -= delta;
    if (this.inputTimer < 0) {
      this.inputTimer = 0;
    }
    // Try moving left, moving right, or rotating. Delay check includes key
    // repeats
    const mover = (updater: (x: number) => void, timeDownPassed: number) => {
      // Make key repeat feel natural
      if (timeDownPassed < this.inputDelay ||
        timeDownPassed > this.inputDelay * inputDelayRatio) {
        if (this.inputTimer === 0) {
          updater(1);
          if (this.checkBlockValid()) {
            this.inputTimer = this.inputDelay;
          }
          else {
            updater(-1);
          }
        }
      }
    };
    const keyUp = this.keyUp;
    const keyLeft = this.keyLeft;
    const keyRight = this.keyRight;
    const keyDown = this.keyDown;
    if (keyUp.isDown) {
      const timeDownPassed = this.time.now - keyUp.timeDown;
      // Bind to make sure context is the block
      mover(this.block.rotate.bind(this.block), timeDownPassed);
    }
    else if (keyLeft.isDown && !keyRight.isDown) {
      const timeDownPassed = this.time.now - keyLeft.timeDown;
      mover((dx: number) => this.block.x -= dx, timeDownPassed);
    }
    else if (keyRight.isDown && !keyLeft.isDown) {
      const timeDownPassed = this.time.now - keyRight.timeDown;
      mover((dx: number) => this.block.x += dx, timeDownPassed);
    }
    else if (keyDown.isDown) {
      if (this.inputTimer === 0) {
        while (!this.executeUpdate()) {
          // Drop it downwards until it freezes
        }
        this.inputTimer = this.inputDelay;
    }
  }

  private updateBlock(delta: number) {
    this.updateTimer += delta;
    while (this.updateTimer >= this.updateDelay) {
      this.updateTimer -= this.updateDelay;
      this.executeUpdate();
    }
  }

  // Return true if block is frozen
  private executeUpdate() {
    // Move the block down and check if a collision occurs
    this.block.y += 1;
    // If one does, move the block back and freeze it
    if (!this.checkBlockValid()) {
      this.block.y -= 1;
      this.grid.fill(this.block.getFilled());
      this.makeNewBlock();
      this.updateTimer = 0;
      return true;
    }
    return false;
  }

  // false: invalid space
  private checkBlockValid(): boolean {
    const blockSpaces = this.block.getFilled();
    const validCoords = allCoords();
    const outOfBoundsSpaces =
      blockSpaces.filter(([x, y]) => coordIndexOf(validCoords, [x, y]) < 0);
    if (outOfBoundsSpaces.length > 0) {
      return false;
    }
    const gridSpaces = this.grid.getFilled();
    const overlapSpaces =
      blockSpaces.filter(([x, y]) => coordIndexOf(gridSpaces, [x, y]) >= 0);
    if (overlapSpaces.length > 0) {
      return false;
    }
    return true;
  }
}

function gridToWorldPos(x: number, y: number): [number, number] {
  return [x * worldScale + worldOffsetX, y * worldScale + worldOffsetY];
}

function renderSpaces(graphics: Graphics, rgb: number) {
  return ([x, y]: [number, number]) => {
    const [worldX, worldY] = gridToWorldPos(x, y);
    graphics.fillStyle(rgb, 1);
    const blockX = worldX + gridLineWidth / 2;
    const blockY = worldY + gridLineWidth / 2;
    const blockSize = worldScale - gridLineWidth;
    graphics.fillRect(blockX, blockY, blockSize, blockSize);
  };
}

export function coordIndexOf(coords: Array<[number, number]>,
  [x, y]: [number, number]): number {
for (let i = 0; i < coords.length; i++) {
  const [elemX, elemY] = coords[i];
  if (x === elemX && y === elemY) {
    return i;
  }
}
return -1;
}
