import Konva from "konva";
import { crop } from "../assets";
import Tool from "./Tool";
import React, { useRef } from "react";

type CropToolProps = {
  imageRef: React.MutableRefObject<Konva.Image | null>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
};
const CropTool = ({ imageRef, layerRef }: CropToolProps) => {
  const rectRef = useRef<Konva.Rect | null>(null);
  const transformRef = useRef<Konva.Transformer | null>(null);

  const handleCrop = () => {
    if (!imageRef.current) return;
    imageRef.current.draggable(false);

    const rect = new Konva.Rect({
      x: imageRef.current.x(),
      y: imageRef.current.y(),
      width: imageRef.current.width(),
      height: imageRef.current.height(),
      scale: imageRef.current.scale(),
      offset: imageRef.current.offset(),
      fill: "rgba(0, 0, 0, 0.5)",
      draggable: true,
    });
    if (rectRef.current) {
      rectRef.current.destroy();
      rectRef.current = null;
    }
    rectRef.current = rect;

    const transform = new Konva.Transformer({
      node: rect,
      rotateEnabled: false,
      draggable: true,
      keepRatio: false,
      flipEnabled: false,
    });
    if (transformRef.current) {
      transformRef.current.destroy();
      transformRef.current = null;
    }
    transformRef.current = transform;

    imageRef.current.getLayer()?.add(rectRef.current);
    imageRef.current.getLayer()?.add(transformRef.current);
  };

  const handleDone = () => {
    console.log(imageRef.current);

    if (!rectRef.current || !imageRef.current || !layerRef.current) return;

    imageRef.current.crop({
      x: rectRef.current.x() - imageRef.current.x(),
      y: rectRef.current.y() - imageRef.current.y(),
      width: rectRef.current.width() * rectRef.current.scaleX(),
      height: rectRef.current.height() * rectRef.current.scaleY(),
    });
    imageRef.current.size({
      width: rectRef.current.width() * rectRef.current.scaleX(),
      height: rectRef.current.height() * rectRef.current.scaleY(),
    });
    imageRef.current.position({
        x: rectRef.current.x(),
        y: rectRef.current.y(),
    })
    console.log(imageRef.current);
    console.log(rectRef.current);
    imageRef.current.clearCache();
    imageRef.current.getLayer()?.batchDraw();
    imageRef.current.cache();
    imageRef.current.draggable(true);
    rectRef.current.destroy();
    rectRef.current = null;
    transformRef.current?.destroy();
    transformRef.current = null;
  };

  return (
    <>
      <Tool toolName="crop" icon={crop} onClick={handleCrop}>
        Crop
      </Tool>
      <button onClick={handleDone}>Done</button>
    </>
  );
};

export default CropTool;
