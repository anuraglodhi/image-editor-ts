import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { useDispatch } from "react-redux";
import useImage from "use-image";
import Konva from "konva";

import FilteredImage from "./components/FilteredImage";
import FilterSelection from "./components/FilterSelection";
import Tool from "./components/Tool";
import { crop, flipX, flipY, rotate, filter, transform, adjust } from "./assets";
import { useSelector } from "react-redux";
import Cropper from "./Cropper";
import CropTool from "./components/CropTool";

function Editor() {
  const imageURL = useSelector((state: any) => state.image.value);
  const [image, imageStatus] = useImage(imageURL);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const [flippedX, setFlippedX] = useState(false);
  const [flippedY, setFlippedY] = useState(false);

  const [showFilerSelection, setShowFilterSelection] = useState(false);

  const [viewportDimensions, SetViewportDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [imageScale, setImageScale] = useState({ x: 1, y: 1 });

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


    if (image && layerRef.current) {
      const scale = Math.min(
        (viewportDimensions.width - 100) / image?.width,
        (viewportDimensions.height - 150) / image?.height
      );
      layerRef.current.scale({
        x: scale,
        y: scale,
      });
      layerRef.current.batchDraw();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [image, layerRef.current]);

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

  const getImageAsBase64 = () => {
    const image = imageRef.current?.clone();
    if (!image) return;
    if (flippedX) {
      image.scale({ x: -1, y: 1 });
    } else if (flippedY) {
      image.scale({ x: 1, y: -1 });
    } else {
      image.scale({ x: 1, y: 1 });
    }
    image.cache();

    return image.toDataURL();
  };

  // function from https://stackoverflow.com/a/15832662/512042
  const downloadURI = (name: string) => {
    const imageURL = getImageAsBase64();

    var link = document.createElement("a");
    link.download = name;
    link.href = imageURL || "#";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const postImage = () => {
    const imageURL = getImageAsBase64();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Anurag Lodhi",
        title: "Test Image",
        photo: imageURL,
      }),
    };

    fetch("https://image-editor-khw1.onrender.com/api/v1/post", requestOptions);
  };

  const handleCrop = () => {
  }

  function handleFlipX() {
    const image = imageRef?.current;
    if (!image) return;

    setImageScale({ x: -imageScale.x, y: imageScale.y });
    image.offsetX(image.getWidth() / 2);
    setFlippedX(!flippedX);
  }

  function handleFlipY() {
    const image = imageRef?.current;
    if (!image) return;

    setImageScale({ x: imageScale.x, y: -imageScale.y });
    image.offsetY(image.getHeight() / 2);
    setFlippedY(!flippedY);
  }

  const handleRotate = () => {
    // rotate the image on stage by 90 degree
    const image = imageRef?.current;
    if (!image) return;
    image.rotate(90);
  };

  const handleTransform = () => {
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

      if (e.target === stage) {
        tr.detach();
        stage.batchDraw();
        return;
      }

      if (e.target === image) {
        return;
      }


      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }


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
  };

  return (
    <div className="h-screen w-screen bg-slate-300 dark:bg-slate-700">
      <header className="fixed top-0 z-10 flex h-14 w-full items-center justify-between rounded-b-xl bg-slate-100 px-4 shadow-slate-100 drop-shadow-md dark:bg-slate-900 dark:shadow-slate-100">
        <div className="text-slate-800 dark:text-slate-200">
          Dimensions{" "}
          {imageStatus === "loaded" && image && (
            <span className="inline-block rounded-md border border-slate-800 px-2 py-1 text-sm text-slate-800 dark:border-slate-200 dark:text-slate-200">
              {image.width} x {image.height}
            </span>
          )}
        </div>
        <div className="flex flex-row items-center text-[32px] font-bold text-slate-800 dark:text-slate-200 ">
          {/* <img src="/Icon.svg" className="mx-2 h-10 w-10" /> */}
          SIMPLE IMAGE EDITOR
        </div>
        <div className="share-section">
          <button
            className="mx-2 rounded-sm border border-slate-200 bg-slate-500 px-2 py-2 font-semibold text-slate-200 drop-shadow-lg hover:bg-slate-600 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-300"
            onClick={postImage}
          >
            Share
          </button>
          <button
            className="drop mx-2 rounded-sm border border-slate-200 bg-slate-500 px-2 py-2 font-semibold text-slate-200 shadow-lg hover:bg-slate-600 dark:border-slate-50 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-300"
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
        <div className="flex h-full w-2/12 max-w-[100px] shrink-0 flex-col items-center justify-start gap-2 bg-slate-100 pt-16 dark:bg-slate-900">
          {/* <Tool toolName="crop" icon={crop} onClick={handleCrop}>

            Crop
          </Tool> */}
          <CropTool imageRef={imageRef} layerRef={layerRef}/>
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
            onClick={() => setShowFilterSelection(!showFilerSelection)}>

            Filters
          </Tool>
          <Tool toolName="transform" icon={transform} onClick={handleTransform}>
            Tform
          </Tool>
          <Tool toolName="adjust" icon={adjust} onClick={() => {}}>
            Adjust
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
              <Layer ref={layerRef}>
                <FilteredImage
                  image={image}

                  ref={imageRef}
                />
                {/* <Cropper /> */}
              </Layer>
            </Stage>
          )}
        </div>

        {/* Details */}

        <div className={`h-screen w-3/12 shrink-0 bg-slate-100 dark:bg-slate-900 pt-16 pb-2 shadow-md`}>
          <div className={`${!showFilerSelection ? "hidden": ""} h-full w-full overflow-y-scroll bg-inherit`}>
            <FilterSelection />
          </div>

        </div>

      </main>
    </div>
  );
}

export default Editor;
