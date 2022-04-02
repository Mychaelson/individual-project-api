const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
  destinationFolder = "posts",
  prefix = "POST",
  fileType = "image",
}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      const fileExtentsion = file.mimetype.split("/")[1];

      const filename = `${prefix}_${nanoid()}.${fileExtentsion}`;

      cb(null, filename);
    },
  });

  const uploader = multer({
    storage,

    // determines wheter the file is allowed to be uploaded or not
    fileFilter: (req, file, cb) => {
      console.log(file);

      // check if file is img
      if (file.mimetype.split("/")[0] != fileType) {
        return cb(null, false);
      }

      cb(null, true);
    },
  });

  return uploader;
};

module.exports = fileUploader;
