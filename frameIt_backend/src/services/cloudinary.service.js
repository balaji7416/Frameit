import cloudinary from "../config/cloudinary.config.js";

const uploadFile = async (fileBuffer, folder = "mini-blog-api") => {
  try {
    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      upload_stream.end(fileBuffer);
    });

    return result;
  } catch (err) {
    console.log("failed to upload to cloudinary, Error: ", err);
    throw err;
  }
};

const deleteFile = async (publicId, resource_type = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });
    return result;
  } catch (err) {
    console.log("failed to delete file from cloudinary, Error: ", err);
    throw err;
  }
};

export { uploadFile, deleteFile };
