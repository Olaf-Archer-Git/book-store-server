const validateMongoose = require("../utils/validateMongoDB");
const {
  cloudinaryUploadIMG,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

const uploadImages = async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadIMG(path, "images");
    const url = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      url.push(newpath);
      fs.unlinkSync(path);
    }
    const images = url.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);

  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error("delete error img", error);
  }
});

module.exports = { uploadImages, deleteImages };
