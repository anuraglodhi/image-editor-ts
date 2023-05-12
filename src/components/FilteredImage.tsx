import Konva from "konva";
import React, { useEffect, useRef, forwardRef } from "react";
import { Image } from "react-konva";
import { useSelector } from "react-redux";

type FilteredImageProps = {
  image: HTMLImageElement;
};

const useForwardedRef = (ref: React.ForwardedRef<Konva.Image>) => {
  const innerRef = useRef<Konva.Image>(null);
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });
  return innerRef;
};

const FilteredImage = forwardRef<Konva.Image, FilteredImageProps>(
  ({ image }: FilteredImageProps, ref) => {
    const filter = useSelector((state: any) => state.filter);
    const safeRef = useForwardedRef(ref);

    useEffect(() => {
      safeRef.current?.cache();

      safeRef.current?.on("mouseenter", () => {
        document.body.style.cursor = "grab";
      });

      safeRef.current?.on("mousedown", () => {
        document.body.style.cursor = "grabbing";
      });

      safeRef.current?.on("mouseup", () => {
        document.body.style.cursor = "grab";
      });

      safeRef.current?.on("mouseleave", () => {
        document.body.style.cursor = "default";
      });
    }, []);

    useEffect(() => {
      console.log("From FilteredImage.tsx");
      
      console.log(safeRef.current);
    });
    return (
      <Image
        image={image}
        width={image.width}
        height={image.height}
        {...filter.value}
        x={-image.width / 2}
        y={-image.height / 2}
        // offsetX={image.width / 2}
        // offsetY={image.height / 2}
        ref={safeRef}
        draggable
      />
    );
  }
);

export default FilteredImage;
