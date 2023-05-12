import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

const Cropper = () => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Rect>(null);

  useEffect(() => {
    if (!trRef.current || !shapeRef.current) return;
    trRef.current?.nodes([shapeRef.current]);
    trRef.current?.getLayer()?.batchDraw();
  }, []);

  return (
    <>
      <Rect x={200} y={200} width={400} height={400} draggable ref={shapeRef} />
      <Transformer ref={trRef} />
    </>
  );
};

export default Cropper;
