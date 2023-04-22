import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Image } from "react-konva";
import { useSelector } from "react-redux";

type FilteredImageProps = {
  image: HTMLImageElement;
  scale: { x: number; y: number };
};

const FilteredImage = ({ image, scale }: FilteredImageProps) => {
  const imageRef = useRef<Konva.Image>(null);
  const filter = useSelector((state: any) => state.filter);

  useEffect(() => {
    imageRef.current?.cache();
  }, []);

  return (
    <Image
      image={image}
      width={image.width}
      height={image.height}
      {...filter.value}
      scale={scale}
      ref={imageRef}
      draggable
    />
  );
};

export default FilteredImage;
