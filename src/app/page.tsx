"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

const aspectRatioOptions = {
  InstagramPost: { width: 1080, height: 1080 },
  InstagramReels: { width: 1080, height: 1920 },
  FacebookPost: { width: 1080, height: 1080 },
  Twitter: { width: 1600, height: 900 },
  LinkedIn: { width: 1200, height: 627 },
  TikTok: { width: 1080, height: 1920 },
  Custom: { width: 500, height: 500 },
};

export default function Home() {
  const [selectedService, setSelectedService] =
    useState<keyof typeof aspectRatioOptions>("InstagramPost");
  const [width, setWidth] = useState(aspectRatioOptions["InstagramPost"].width);
  const [height, setHeight] = useState(
    aspectRatioOptions["InstagramPost"].height
  );

  const [src, setSrc] = useState<string | null>(null);

  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    setWidth(aspectRatioOptions[selectedService].width);
    setHeight(aspectRatioOptions[selectedService].height);
  }, [selectedService]);

  useEffect(() => {
    const img = new Image();

    img.crossOrigin = "Anonymous"; // Needed if the image is served from a different domain
    img.src =
      "https://www.bearsforhumanity.com/cdn/shop/files/IMG_1792copy_1024x1024.jpg?v=1696342413";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1000;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "rgba(255, 255, 255, 0)"; // Transparent background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the image at the center
      ctx.drawImage(
        img,
        (canvas.width - 500) / 2,
        (canvas.height - 500) / 2,
        500,
        500
      );

      // Create a Blob URL from the canvas
      canvas.toBlob((blob) => {
        if (!blob) return;

        const newSrc = URL.createObjectURL(blob);
        setSrc(newSrc);
      });
    };
  }, []);

  if (!src) return null;

  return (
    <main className="flex min-h-screen justify-center flex-col items-center gap-4">
      <div
        style={{
          width: `${300}px`,
          height: `${300}px`,
          overflow: "hidden",
          position: "relative", // Make sure the position is relative to contain the absolutely positioned cropper within
        }}
      >
        <Cropper
          ref={cropperRef}
          src={src}
          defaultVisibleArea={{
            height: 500,
            width: 500,
            top: 250,
            left: 250,
          }}
          defaultCoordinates={{
            height: 200,
            width: 200,
          }}
          stencilProps={{
            aspectRatio:
              selectedService !== "Custom" ? width / height : undefined,
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="service-select">Service</label>
        <select
          id="service-select"
          value={selectedService}
          onChange={(e) =>
            setSelectedService(
              e.target.value as keyof typeof aspectRatioOptions
            )
          }
          className="mb-4 p-2 border-2 border-gray-300 rounded"
        >
          {Object.keys(aspectRatioOptions).map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        <label htmlFor="width-input">Width (px)</label>
        <input
          id="width-input"
          type="text"
          value={width}
          onChange={(e) => {
            setSelectedService("Custom");
            const newValue = Number(e.target.value);
            if (!isNaN(newValue) && newValue > 0) {
              setWidth(newValue);
            }
          }}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className="mb-4 p-2 border-2 border-gray-300 rounded"
        />
        <label htmlFor="height-input">Height (px)</label>
        <input
          id="height-input"
          type="text"
          value={height}
          onChange={(e) => {
            setSelectedService("Custom");
            const newValue = Number(e.target.value);
            if (!isNaN(newValue) && newValue > 0) {
              setHeight(newValue);
            }
          }}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className="mb-4 p-2 border-2 border-gray-300 rounded"
        />
      </div>
      <button>
        <a
          href="#"
          onClick={() => {
            if (!cropperRef.current) return;
            const canvas = cropperRef.current.getCanvas({
              width,
              height,
            });

            if (canvas) {
              const dataURL = canvas.toDataURL();
              const link = document.createElement("a");
              link.download = "cropped-image.png";
              link.href = dataURL;
              link.click();
            }
          }}
        >
          Download
        </a>
      </button>
    </main>
  );
}
