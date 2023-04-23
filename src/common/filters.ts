import Konva from "konva";
import { FilterState } from "../features/filter/filterSlice";

const Filters = {
  none: {
    filters: [],
  },
  invert: {
    filters: [
      Konva.Filters.Invert
    ]
  },
  grayscale: {
    filters: [
      Konva.Filters.Grayscale
    ],
  },
  fade: {
    filters: [

      Konva.Filters.HSL,
      Konva.Filters.Contrast
    ],
    contrast: 15,
    luminance: 0.45,
    saturation:-0.25,
  },
  mono: {
    filters: [
      Konva.Filters.Grayscale,
      Konva.Filters.Brighten,
      Konva.Filters.Contrast,
      Konva.Filters.HSL
    ],
    brightness: 0.12,
    contrast: 30,
    lightness: 4,

  },
  retro: {
    filters: [
      Konva.Filters.Blur,
      Konva.Filters.Noise,
      // Konva.Filters.Sepia,
      Konva.Filters.RGBA,
      Konva.Filters.HSL,
    ],
    blurRadius: 2,
    red: 150,
    green: 105,
    blue: 40,
    alpha: 0.5,
    noise: 0.1,
    saturation: -1,
  },
  "pop art": {
    filters: [Konva.Filters.HSL, Konva.Filters.Contrast],
    contrast: 3,
    saturation: 0.5,
  },
  pastel: {
    filters: [Konva.Filters.Blur, Konva.Filters.HSL, Konva.Filters.RGBA],
    saturation: -1.5,
    blurRadius: 3,
    red: 255,
    green: 180,
    blue: 200,
    alpha: 0.4,
  },
  // green: {
  //   filters: [Konva.Filters.Enhance],
  //   enhance: 20,
  // },
  outrun: {
    filters: [
      Konva.Filters.RGB, 
      Konva.Filters.Brighten, 
      Konva.Filters.Contrast,
      Konva.Filters.HSL,
    ],
    hue: 25,
    saturation: 1.2,
    luminance: 0.05,
    contrast: 25,
    brightness: 0.1,
    red:215,
    green:60,
    blue: 255,
  },
  "x-pro": {
    filters: [
      Konva.Filters.RGB, 
      Konva.Filters.Brighten, 
      Konva.Filters.Contrast,
      Konva.Filters.HSL,
    ],
    luminance: 0.4,
    contrast: 120,
    hue: 25,
    brightness: 0.15,
    red:85,
    green:150,
    blue: 250,
  },
};

export default Filters;
