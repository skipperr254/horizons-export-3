import { useState, useEffect, useCallback } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

const CloudinaryUpload = () => {
  const CLOUDINARY_CONFIG = {
    cloudName: "",
    uploadPreset: "",
    defaultImage: "avatar-pic",
  };

  // Create a Cloudinary instance for the product environment.
  const cld = new Cloudinary({
    cloud: {
      cloudName: CLOUDINARY_CONFIG.cloudName,
    },
  });

  return <div></div>;
};

export default CloudinaryUpload;
