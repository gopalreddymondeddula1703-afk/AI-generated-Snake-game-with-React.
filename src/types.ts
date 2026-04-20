export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export type GameState = 'start' | 'playing' | 'gameover';

export interface Point {
  x: number;
  y: number;
}
