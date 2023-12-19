import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  board,
  colorPallete,
  piece,
} from './constants';
import { BLOCK_SIZE } from './constants/sizes';

function App() {
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Inicializar el canvas
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = BLOCK_SIZE * BOARD_WIDTH;
      canvasRef.current.height = BLOCK_SIZE * BOARD_HEIGHT;
      setCanvasContext(canvasRef.current.getContext('2d'));
    }
  }, [canvasRef]);

  useEffect(() => {
    canvasContext && canvasContext.scale(BLOCK_SIZE, BLOCK_SIZE);
  }, [canvasContext]);

  // Game loop
  const draw = useCallback(() => {
    if (canvasContext && canvasRef.current) {
      canvasContext.fillStyle = '#000';
      canvasContext.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      board.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value === 1) {
            canvasContext.fillStyle = colorPallete.orange;
            canvasContext.fillRect(x, y, 1, 1);
          }
        });
      });

      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            canvasContext.fillStyle = colorPallete.blue;
            canvasContext.fillRect(
              x + piece.position.x,
              y + piece.position.y,
              1,
              1
            );
          }
        });
      });
    }
  }, [canvasContext, canvasRef]);

  const update = useCallback(() => {
    draw();
    window.requestAnimationFrame(update);
  }, [draw]);

  update();

  // Collision
  const checkCollision = useCallback(() => {
    return piece.shape.find((row, y) => {
      return row.find((value, x) => {
        return (
          value !== 0 &&
          board[y + piece.position.y]?.[x + piece.position.x] !== 0
        );
      });
    });
  }, []);

  // Movimientos
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        piece.position.x--;
        if (checkCollision()) {
          piece.position.x++;
        }
      }
      if (e.key === 'ArrowRight') {
        piece.position.x++;
        if (checkCollision()) {
          piece.position.x--;
        }
      }
      if (e.key === 'ArrowDown') {
        piece.position.y++;
        if (checkCollision()) {
          piece.position.y--;
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => document.removeEventListener('keydown', handleKeydown);
  }, [checkCollision]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default App;
