// Bacon Pixel Editor — Constants
export const CONFIG = {
  // Canvas / project limits
  CANVAS_MIN: 1,
  CANVAS_MAX: 512,
  CANVAS_DEFAULT_W: 16,
  CANVAS_DEFAULT_H: 16,

  // FPS
  FPS_MIN: 1,
  FPS_MAX: 60,
  FPS_DEFAULT: 12,

  // Brush
  BRUSH_MIN: 1,
  BRUSH_MAX: 16,

  // Zoom
  ZOOM_MIN: 1,
  ZOOM_MAX: 64,
  ZOOM_FIT_MARGIN: 40,

  // Preview zoom
  PREVIEW_ZOOM_MIN: 0.5,
  PREVIEW_ZOOM_MAX: 8,
  PREVIEW_ZOOM_DEFAULT: 2,
  PREVIEW_BASE_SIZE: 60,
  PREVIEW_BASE_MIN: 20,

  // Undo
  MAX_UNDO: 50,

  // Resizer panel limits (px)
  LF_PANEL_MIN_H: 60,
  LF_PANEL_MAX_H: 500,
  PALETTE_PANEL_MIN_H: 80,
  PALETTE_PANEL_MAX_H: 600,
  MEMO_MIN_H: 40,
  MEMO_MAX_H: 400,
  RIGHT_PANEL_MIN_W: 180,
  RIGHT_PANEL_MAX_W: 520,

  // Thumbnail cell size (px)
  THUMB_SIZE: 36,

  // Marching ants
  MARCH_STEP: 0.4,
  MARCH_PERIOD: 8,

  // Rotation handle
  ROT_HANDLE_RADIUS: 6,
  ROT_HANDLE_HIT_RADIUS: 10,
  ROT_HANDLE_OFFSET: 20,

  // Palette import from image
  PAL_IMPORT_MAX_SIZE: 128,
  PAL_IMPORT_MAX_COLORS: 64,
  PAL_IMPORT_ALPHA_THRESHOLD: 16,

  // Auto-save debounce (ms)
  SAVE_DEBOUNCE_MS: 2000,

  // Grid / mirror guide visibility threshold
  GRID_MIN_ZOOM: 3,
  MIRROR_GUIDE_MIN_ZOOM: 2,

  // localStorage keys
  STORAGE_KEY: 'bpe_save',
  THEME_KEY: 'bpe_theme',
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
