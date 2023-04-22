import Konva from "konva";
import { FilterState } from "../features/filter/filterSlice";

const Filters = {
  none: {
    filters: [],
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
  green: {
    filters: [Konva.Filters.Enhance],
    enhance: 20,
  },
};

export default Filters;
