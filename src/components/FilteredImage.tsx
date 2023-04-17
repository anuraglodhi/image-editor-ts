import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Image } from "react-konva";
import { useSelector } from "react-redux";

type FilteredImageProps = {
  image: HTMLImageElement;
};

const FilteredImage = ({ image }: FilteredImageProps) => {
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
      {...filter}
      ref={imageRef}
    />
  );
};

export default FilteredImage;
