import { useRef, useState } from "react";

const useDraw = () => {
  const canvasRef = useRef(null);
  const [showDrawOptions, setShowDrawOptions] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<string | undefined>();
  const [hex, setHex] = useState<string>("#000000");
  const [brushWidth, setBrushWidth] = useState<number>(12);


  return { hex, setHex, showDrawOptions, setShowDrawOptions, canvasRef, drawing, brushWidth};
};

export default useDraw;
