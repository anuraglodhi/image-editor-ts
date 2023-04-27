import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import useImage from "use-image";
import FilteredImage from "./components/FilteredImage";
import FilterSelection from "./components/FilterSelection";
import Konva from "konva";

function Editor() {
  const [image, imageStatus] = useImage("/src/assets/cube.jpg");
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

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

    if (image)
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
    image.scale({ x: 1, y: 1 });
    image.cache();

    var link = document.createElement("a");
    link.download = name;
    link.href = image.toDataURL() || "#";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="h-screen w-screen bg-slate-300">
      <header className="fixed top-0 z-10 flex h-14 w-full items-center justify-between rounded-b-xl bg-slate-100 px-4 drop-shadow-md">
        <div className="">
          Dimensions{" "}
          {imageStatus === "loaded" && image && (
            <span className="inline-block rounded-md border border-slate-800 px-2 py-1 text-sm">
              {image.width} x {image.height}
            </span>
          )}
        </div>
        <div className="name flex flex-row items-center from-neutral-800 font-semibold">
          <img src="/Icon.svg" className="mx-2 h-10 w-10" />
          Image Editor
        </div>
        <div className="share-section">
          <button className="mx-2">Share</button>
          <button
            className="mx-2"
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
        <div className="h-full w-2/12 max-w-[100px] shrink-0 bg-slate-100 pt-14">
          {/* <Tool toolName="blur" onClick={handleBlur}>
            Blur
          </Tool>
          <Tool toolName="clear" onClick={handleClear}>
            Clear
          </Tool> */}
          {/*<Tool toolName="resize" onClick={handleToolClick}>Resize</Tool> */}
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
              x={viewportDimensions.width / 2 - (image.width * imageScale) / 2}
              y={
                viewportDimensions.height / 2 -
                (image.height * imageScale) / 2 +
                25
              }
              onWheel={handleZoom}
            >
              <Layer>
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
        <div className="h-full w-3/12 shrink-0 bg-slate-100 pt-14 shadow-md">
          <FilterSelection />
        </div>
      </main>
    </div>
  );
}

export default Editor;
