import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { KonvaNodeComponent, Layer, Stage } from "react-konva";
import { useDispatch } from "react-redux";
import useImage from "use-image";
import { applyFilter } from "./features/filter/filterSlice";
import FilteredImage from "./components/FilteredImage";
import Tool from "./components/Tool";
import FilterSelection from "./components/FilterSelection";
import { stages } from "konva/lib/Stage";
import Konva from "konva";

function Editor() {
  const [image, imageStatus] = useImage("/src/assets/cube.jpg");
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [viewportDimensions, SetViewportDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [imageScale, setImageScale] = useState(1);

  useEffect(() => {
    const width = viewportRef.current?.clientWidth || 0;
    const height = viewportRef.current?.clientHeight || 0;
    SetViewportDimensions({
      width: width,
      height: height,
    });

    if(image)
      setImageScale(
        Math.min((width - 100) / image?.width, (height - 150) / image?.height)
      );
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
  };

  const downloadURI = (uri: string | undefined, name: string | undefined) => {
    var link = document.createElement("a");
    link.download = name as string;
    link.href = uri as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const options = {
      quality: 1,
      pixelRatio: 1,
      width: stageRef?.current!.getAbsoluteScale().x * image!.width,
      height: stageRef?.current!.getAbsoluteScale().y * image!.height,
      x: stageRef?.current?.getStage().getPosition().x,
      y: stageRef?.current?.getStage().getPosition().y
    };
    const dataURL = stageRef?.current?.toDataURL(options);
    downloadURI(dataURL,'cube.png');
  };

  return (
    <div className="h-screen w-screen bg-slate-300">
      <header className="fixed top-0 z-10 flex h-14 w-full items-center justify-between bg-slate-100 px-4 drop-shadow-md rounded-b-xl">
        <div className="">
          Dimensions{" "}
          {imageStatus === "loaded" && image && (
            <span className="inline-block rounded-md border border-slate-800 px-2 py-1 text-sm">
              {image.width} x {image.height}
            </span>
          )}
        </div>
        <div className="name flex flex-row from-neutral-800 font-semibold items-center">
          <img src = "/Icon.svg" className="h-10 w-10 mx-2"/>
          Image Editor
        </div>
        <div className="share-section">
          <button className="mx-2 rounded-sm bg-slate-500 hover:bg-slate-600 border border-slate-300 px-2 py-2 font-semibold text-slate-200 drop-shadow-lg">Share</button>
          <button
            className="mx-2 rounded-sm bg-slate-500 hover:bg-slate-600 border border-slate-300 px-2 py-2 font-semibold text-slate-200 drop shadow-lg"
            onClick={handleDownload}
          >Download</button>
        </div>
      </header>

      <main className="flex h-full flex-nowrap overflow-hidden shadow-md">
        {/* Toolbar */}
        {/* <div className="h-full w-2/12 max-w-[100px] shrink-0 bg-slate-100 pt-14"> */}
          {/* <Tool toolName="blur" onClick={handleBlur}>
            Blur
          </Tool>
          <Tool toolName="clear" onClick={handleClear}>
            Clear
          </Tool> */}
          {/*<Tool toolName="resize" onClick={handleToolClick}>Resize</Tool> */}
        {/* </div> */}

        {/* Workspace */}
        <div
          className="grid shrink grow place-content-center overflow-hidden"
          ref={viewportRef}
        >
          {imageStatus === "loaded" && image && (
            <Stage
              width={viewportDimensions.width}
              height={viewportDimensions.height}
              x={viewportDimensions.width / 2 - 
                (image.width * imageScale) / 2}
              y={
                viewportDimensions.height / 2 -
                (image.height * imageScale) / 2 +
                25
              }
              ref = {stageRef}
              onWheel={handleZoom}
            >
              <Layer>
                <FilteredImage
                  image={image}
                  scale={{ x: imageScale, y: imageScale }}
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
