import multer from "multer";

const storage = multer.diskStorage({
  filename: function (res, file, cb) {
    const ext = file.originalname.split(".").pop();
    const fileName =  Date.now();
    cb(null, `${fileName}.${ext}`);
  },
  destination: function (res, file, cb) {
    cb(null, "./src/public");
  },
});

export const upload = multer({ storage });