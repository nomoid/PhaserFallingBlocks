import 'phaser';
import { Block, BlockType, randomBlockType } from '../block';

import phaserPng from '../assets/phaser.png';

type Graphics = Phaser.GameObjects.Graphics;

// Size of a grid space
const worldScale = 20;
const worldOffsetX = 400;
const worldOffsetY = 300;

export class MainScene extends Phaser.Scene {
  private image!: Phaser.GameObjects.Image;
  private graphics!: Graphics;
  private block!: Block;

  constructor() {
    super({ key: 'MainScene' });
  }

  public preload() {
    this.load.image('phaser', phaserPng);
  }

  public create() {
    this.graphics = this.add.graphics();

    this.block = new Block(randomBlockType());

    this.input.on('pointerdown', (event: any) => {
      this.block = new Block(randomBlockType());
    });

  }

  public update() {
    const graphics = this.graphics;
    graphics.clear();
    graphics.fillStyle(0x0000ff, 1);

    const gridFiller = (x: number, y: number) => {
      const [worldX, worldY] = gridToWorldPos(x, y);
      graphics.fillRect(worldX, worldY, worldScale, worldScale);
    };

    this.block.fill(gridFiller);
  }
}

function gridToWorldPos(x: number, y: number): [number, number] {
  return [x * worldScale + worldOffsetX, y * worldScale + worldOffsetY];
}
