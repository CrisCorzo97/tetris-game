import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { BOARD_HEIGHT, BOARD_WIDTH, board, colorPallete } from './constants';
import { BLOCK_SIZE } from './constants/sizes';

function App() {
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Inicializar el canvas
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

  // 2. Game loop
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
    }
  }, [canvasContext, canvasRef]);

  const update = useCallback(() => {
    draw();
    window.requestAnimationFrame(update);
  }, [draw]);

  update();

  // 3. Board

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default App;
