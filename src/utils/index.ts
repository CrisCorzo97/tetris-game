import { BoardType } from '../types';

export const createBoard = (sizes: {
  width: number;
  height: number;
}): BoardType => {
  return Array(sizes.height)
    .fill(undefined)
    .map(() => Array(sizes.width).fill(0));
};
