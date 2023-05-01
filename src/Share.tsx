import React, { FormEvent } from "react";
import cube from "/src/assets/cube.jpg";
import test from "/src/assets/test.jpg";
import { useDispatch } from "react-redux";
import { setImage } from "./features/image/imageSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Share = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpload = (e: FormEvent) => {
    const input = e.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const url = `data:${file.type};base64,${btoa(
        event.target?.result as string
      )}`;
      dispatch(setImage(url));
    };
    navigate("/editor");
  };

  return (
    <>
      <header className="flex h-16 items-center bg-slate-200 px-4 text-3xl font-bold">
        Simple Image Editor
      </header>
      <main>
        <section className="flex h-[400px] items-center justify-center bg-slate-100">
          <label
            htmlFor="file-input"
            className="flex h-16 w-48 items-center justify-center rounded-lg border bg-slate-300 hover:bg-slate-400 active:bg-slate-500"
          >
            Select Image
          </label>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </section>
        <section className="flex flex-col items-center p-4">
          <div className="max-w-screen-lg">
            <h2 className="w-full text-xl">See what others have done</h2>
            <div className="columns-3 gap-4">
              <img src={cube} alt="" width={500} className="w-full pb-4" />
              <img src={test} alt="" width={200} className="w-full pb-4" />
              <img src={cube} alt="" width={500} className="w-full pb-4" />
              <img src={test} alt="" width={400} className="w-full pb-4" />
              <img src={test} alt="" width={300} className="w-full pb-4" />
              <img src={test} alt="" width={600} className="w-full pb-4" />
              <img src={cube} alt="" width={500} className="w-full pb-4" />
              <img src={cube} alt="" width={500} className="w-full pb-4" />
              <img src={test} alt="" width={600} className="w-full pb-4" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Share;
