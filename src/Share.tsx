import React, { FormEvent, useEffect, useState } from "react";
import cube from "/src/assets/cube.jpg";
import test from "/src/assets/test.jpg";
import { useDispatch } from "react-redux";
import { setImage } from "./features/image/imageSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Share = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://image-editor-khw1.onrender.com/api/v1/post")
      .then((response) => response.json())
      .then((result) => setPosts(result.data));
  });

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
      {/* <header className="flex h-16 items-center bg-slate-200 px-4 text-3xl font-bold"> */}
      <header className="fixed top-0 z-10 flex h-14 w-full items-center justify-center rounded-b-sm bg-slate-100 px-4 shadow-slate-100 drop-shadow-md dark:bg-slate-900 dark:shadow-slate-100">
        <div className="flex flex-row items-center text-[32px] font-bold text-slate-800 dark:text-slate-200">
          SIMPLE IMAGE EDITOR
        </div>
      </header>
      <main>
        <section className="flex h-[400px] items-center justify-center bg-slate-200 dark:bg-slate-700">
          <label
            htmlFor="file-input"
            // className="flex h-16 w-48 items-center justify-center rounded-lg border bg-slate-300 hover:bg-slate-400 active:bg-slate-500"
            className="rounded-sm bg-slate-500 px-4 py-4 font-semibold text-slate-200 drop-shadow-lg hover:bg-slate-600 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-300"
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
        <section className="flex flex-col items-center bg-slate-200 p-4 dark:bg-slate-800">
          <div className="max-w-screen-lg">
            <h2 className="w-full pb-2 text-2xl font-bold text-slate-800 dark:text-slate-200">
              See what others have done
            </h2>
            <div className="columns-3 gap-4">
              {posts &&
                posts.map((post: any) => {
                  return (
                    <img
                      src={post.photo}
                      alt={post.title}
                      className="mb-4 rounded-lg shadow-slate-100 drop-shadow-md dark:shadow-slate-100"
                      key={post._id}
                    />
                  );
                })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Share;
