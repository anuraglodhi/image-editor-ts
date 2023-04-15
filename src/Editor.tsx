import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";

function Tool({
  toolName,
  // onClick,
  children,
}: {
  toolName: string;
  // onClick: (toolName: string) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        className="h-16 w-full border-b-2 hover:bg-slate-200 active:bg-slate-300" /*onClick={() => onClick(toolName)}*/
      >
        {children}
      </button>
    </>
  );
}

function Editor() {
  const [image, imageStatus] = useImage("/src/assets/cube.jpg");
  const viewportRef = useRef<HTMLDivElement>(null);

  const [viewportDimensions, SetViewportDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    SetViewportDimensions({
      width: viewportRef.current?.clientWidth || 0,
      height: viewportRef.current?.clientHeight || 0,
    });
  }, []);

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
  };

  return (
    <div className="h-screen w-screen bg-slate-300">
      <header className="fixed top-0 z-10 flex h-14 w-full items-center justify-between bg-slate-100 px-4 drop-shadow-md">
        <div className="">
          Dimensions{" "}
          {imageStatus === "loaded" && image && (
            <span className="inline-block rounded-md border border-slate-800 px-2 py-1 text-sm">
              {image.width} x {image.height}
            </span>
          )}
        </div>
        <div className="name">Image Editor</div>
        <div className="share-section">
          <button>Share</button>
          <button>Download</button>
        </div>
      </header>

      <main className="flex h-full flex-nowrap overflow-hidden shadow-md">
        {/* Toolbar */}
        <div className="h-full w-2/12 max-w-[100px] shrink-0 bg-slate-100 pt-14">
          <Tool toolName="blur" /*onClick={handleToolClick}*/>Blur</Tool>
          <Tool toolName="crop" /*onClick={handleToolClick}*/>Crop</Tool>
          <Tool toolName="resize" /*onClick={handleToolClick}*/>Resize</Tool>
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
              x={viewportDimensions.width / 2 - image.width / 2}
              y={viewportDimensions.height / 2 - image.height / 2}
              onWheel={handleZoom}
            >
              <Layer>
                <Image
                  image={image}
                  // x={viewportDimensions.width / 2 - image.width / 2}
                  // y={viewportDimensions.height / 2 - image.height / 2}
                  width={image.width}
                  height={image.height}
                  filters={[Konva.Filters.Blur, Konva.Filters.Sepia]}
                  blurRadius={10}
                  // ref={imageRef}
                />
              </Layer>
            </Stage>
          )}
        </div>

        {/* Details */}
        <div className="h-full w-3/12 shrink-0 bg-slate-100 pt-14 shadow-md">
          <div className="tool-name">
            {/* {tool.slice(0, 1).toUpperCase() + tool.slice(1)} */}
          </div>
          <input
            type="range"
            // onChange={(e) => dispatch(change(parseInt(e.target.value)))}
          />
        </div>
      </main>
    </div>
  );
}

export default Editor;
