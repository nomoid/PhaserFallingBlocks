import { MainScene } from './scenes/mainScene';

export const screenWidth = 800;
export const screenHeight = 600;

const config: GameConfig = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  scene: [MainScene],
};

const game = new Phaser.Game(config);
