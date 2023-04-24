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

    imageRef.current?.on("mouseenter", () => {
      document.body.style.cursor = "grab";
    });

    imageRef.current?.on("mousedown", () => {
      document.body.style.cursor = "grabbing";
    });

    imageRef.current?.on("mouseup", () => {
      document.body.style.cursor = "grab";
    });

    imageRef.current?.on("mouseleave", () => {
      document.body.style.cursor = "default";
    });
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
