import Resizer from "react-image-file-resizer";

const resizeProfile = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      400,
      400,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

const resizeThreadImage = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1200,
      600,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export { resizeProfile, resizeThreadImage };
