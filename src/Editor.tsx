import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { useDispatch } from "react-redux";
import useImage from "use-image";
import Konva from "konva";

import FilteredImage from "./components/FilteredImage";
import FilterSelection from "./components/FilterSelection";
import Tool from "./components/Tool";
import { crop, flipX, flipY, rotate, filter, transform } from "./assets";
import { useSelector } from "react-redux";

function Editor() {
  const imageURL = useSelector((state: any) => state.image.value);
  const [image, imageStatus] = useImage(imageURL);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const [flippedX, setFlippedX] = useState(false);
  const [flippedY, setFlippedY] = useState(false);

  const [viewportDimensions, SetViewportDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [imageScale, setImageScale] = useState(1);

  const handleResize = () => {
    const width = viewportRef.current?.clientWidth || 0;
    const height = viewportRef.current?.clientHeight || 0;
    SetViewportDimensions({
      width: width,
      height: height,
    });
  };

  useEffect(() => {
    const width = viewportRef.current?.clientWidth || 0;
    const height = viewportRef.current?.clientHeight || 0;
    SetViewportDimensions({
      width: width,
      height: height,
    });
    window.addEventListener("resize", handleResize);

    if(image)
      setImageScale(
        Math.min(
          (viewportDimensions.width - 100) / image?.width,
          (viewportDimensions.height - 150) / image?.height
        )
      );

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [image]);

  const handleZoom = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();

    if (!stage || !stage.pointerPos) return;

    if (
      (e.evt.deltaY > 0 && stage.scaleX() < 0.5) ||
      (e.evt.deltaY < 0 && stage.scaleX() > 2)
    )
      return;

    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.pointerPos.x / oldScale - stage.x() / oldScale,
      y: stage.pointerPos.y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - stage.pointerPos.x / newScale) * newScale,
      y: -(mousePointTo.y - stage.pointerPos.y / newScale) * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
    // console.log(newScale);
  };

  // function from https://stackoverflow.com/a/15832662/512042
  function downloadURI(name: string) {
    const image = imageRef.current?.clone();
    if (!image) return;
    if(flippedX) {
      image.scale({x: -1, y: 1});
    } else if(flippedY) {
      image.scale({x: 1, y: -1});
    } else {
      image.scale({ x: 1, y: 1 });
    }
    image.cache();

    var link = document.createElement("a");
    link.download = name;
    link.href = image.toDataURL() || "#";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleCrop = () => {
    // to-do add crop functionality
    
  };

  function handleFlipX() {
    const image = imageRef?.current;
    if (!image) return;

    setFlippedX(true);
    image.scaleX(-image.scaleX());
    image.offsetX(image.getWidth() / 2);
  }

  function handleFlipY() {
    const image = imageRef?.current;
    if (!image) return;
    setFlippedY(!flippedY);
    image.scaleY(-image.scaleY());
    image.offsetY(image.getHeight() / 2);
  }

  // const handleFilter = () => {

  // }

  const handleRotate = () => {
    // rotate the image on stage by 90 degree
    const image = imageRef?.current;
    if (!image) return;
    image.rotate(90);
  }

  const handleTransform = () => {
    // add a konva transformer to image and remove after use
    const image = imageRef?.current;
    if (!image) return;

    const stage = stageRef?.current;
    if (!stage) return;

    const tr = new Konva.Transformer();
    tr.rotationSnaps([0, 45, 90, 135, 180, 225, 270]);
    layerRef?.current?.add(tr);
    tr.nodes([image]);
    stage.batchDraw();

    const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
      // clicked on stage - clear selection
      if (e.target === stage) {
        tr.detach();
        stage.batchDraw();
        return;
      }
      // clicked on image - do nothing
      if (e.target === image) {
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = imageRef?.current;
      if (!rect) return;

      const isSelected = name === image.name();
      if (isSelected) {
        tr.detach();
        stage.batchDraw();
        return;
      }

      tr.attachTo(rect);
      stage.batchDraw();
    };

    stage.on("mousedown", handleStageMouseDown);
  }

  return (
    <div className="h-screen w-screen bg-slate-300 dark:bg-slate-700">
      <header className="fixed top-0 z-10 flex h-14 w-full items-center justify-between rounded-b-xl bg-slate-100 dark:bg-slate-900 px-4 shadow-slate-100 dark:shadow-slate-100 drop-shadow-md">
        <div className="text-slate-800 dark:text-slate-200">
          Dimensions{" "}
          {imageStatus === "loaded" && image && (
            <span className="inline-block rounded-md border border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200 px-2 py-1 text-sm">
              {image.width} x {image.height}
            </span>
          )}
        </div>
        <div className="flex flex-row items-center text-[32px] font-bold text-slate-800 dark:text-slate-200 ">
          {/* <img src="/Icon.svg" className="mx-2 h-10 w-10" /> */}
          SIMPLE IMAGE EDITOR
        </div>
        <div className="share-section">
          <button className="mx-2 rounded-sm border border-slate-200 bg-slate-500 dark:bg-slate-100 px-2 py-2 font-semibold text-slate-200 dark:text-slate-800 drop-shadow-lg hover:bg-slate-600 dark:hover:bg-slate-300">
            Share
          </button>
          <button
            className="drop mx-2 rounded-sm border border-slate-200 dark:border-slate-50 bg-slate-500 dark:bg-slate-100 px-2 py-2 font-semibold text-slate-200 dark:text-slate-800 shadow-lg hover:bg-slate-600 dark:hover:bg-slate-300"
            onClick={() => {
              if (imageRef.current) downloadURI("cubeEdited.jpg");
            }}
          >
            Download
          </button>
        </div>
      </header>

      <main className="flex h-full flex-nowrap overflow-hidden shadow-md">
        {/* Toolbar */}
        <div className="flex h-full w-2/12 max-w-[100px] shrink-0 flex-col items-center justify-start gap-2 bg-slate-100 dark:bg-slate-900 pt-16">
          <Tool
            toolName="crop"
            icon={crop}
            onClick={handleCrop}>
            Crop
          </Tool>
          <Tool
            toolName="flipX"
            icon={flipX}
            onClick={() => {
              if (imageRef.current) handleFlipX();
            }}
          >
            Flip X
          </Tool>
          <Tool
            toolName="flipY"
            icon={flipY}
            onClick={() => {
              if (imageRef.current) handleFlipY();
            }}
          >
            Flip Y
          </Tool>
          <Tool
            toolName="rotate"
            icon={rotate}
            onClick={() => {
              if (imageRef.current) handleRotate();
            }}
          >
            Rotate
          </Tool>
          <Tool toolName="filter" 
            icon={filter}
            onClick={()=>{}}>
            Filters
          </Tool>
          <Tool toolName="transform" 
            icon={transform}
            onClick={handleTransform}>
            Transform
          </Tool>
          {/* <Tool toolName="blur" onClick={handleBlur}>
            Blur
          </Tool>
          <Tool toolName="clear" onClick={handleClear}>
            Clear
          </Tool>
          <Tool toolName="resize" onClick={handleToolClick}>Resize</Tool> */}
        </div>

        {/* Workspace */}
        <div
          className="grid shrink grow place-content-center overflow-hidden"
          ref={viewportRef}
        >
          {imageStatus === "loaded" && image && (
            <Stage
              width={viewportDimensions.width}
              height={viewportDimensions.height}
              // x={viewportDimensions.width / 2 -
              //   (image.width * imageScale) / 2}
              // y={
              //   viewportDimensions.height / 2 -
              //   (image.height * imageScale) / 2 +
              //   25
              // }
              x={viewportDimensions.width / 2}
              y={viewportDimensions.height / 2 + 25}
              ref={stageRef}
              onWheel={handleZoom}
            >
              <Layer
                ref={layerRef}
              >
                <FilteredImage
                  image={image}
                  scale={{ x: imageScale, y: imageScale }}
                  ref={imageRef}
                />
              </Layer>
            </Stage>
          )}
        </div>

        {/* Details */}
        <div className="h-screen w-3/12 shrink-0 overflow-y-scroll bg-slate-100 dark:bg-slate-900 pt-16 pb-2 shadow-md">
          <FilterSelection />
        </div>
      </main>
    </div>
  );
}

export default Editor;
