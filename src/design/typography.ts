// typography.ts

import {TextStyle} from 'react-native';
import {PRIMARY_TEXT, SECONDARY_TEXT} from './theme';

/**
 * Base font families used in the app.
 */
export const FONT_FAMILY = {
  REGULAR: 'System',
  BOLD: 'System-Bold',
};

/**
 * Base font sizes for the app.
 */
export const FONT_SIZE = {
  SM: 12, // Small
  MD: 16, // Medium
  LG: 20, // Large
  XL: 24, // Extra Large
  XXL: 32, // Double Extra Large
};

/**
 * Typography styles for use throughout the app.
 * These styles are designed to ensure consistency in text appearance.
 */
export const TYPOGRAPHY: {[key: string]: TextStyle} = {
  /**
   * h1 - Headline 1
   * Usage: Main titles or primary headers on screens.
   */
  h1: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: FONT_SIZE.XXL,
    lineHeight: 40,
    letterSpacing: 0.5,
    color: PRIMARY_TEXT, // Light color for readability on dark backgrounds
  },

  /**
   * h2 - Headline 2
   * Usage: Subtitles or secondary headers on screens.
   */
  h2: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: FONT_SIZE.XL,
    lineHeight: 32,
    letterSpacing: 0.25,
    color: PRIMARY_TEXT,
  },

  /**
   * h3 - Headline 3
   * Usage: Tertiary headers or section titles within content.
   */
  h3: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: FONT_SIZE.LG,
    lineHeight: 28,
    letterSpacing: 0,
    color: PRIMARY_TEXT,
  },

  /**
   * b1 - Body Text 1
   * Usage: Standard body text for paragraphs and main content.
   */
  b1: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: FONT_SIZE.MD,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: PRIMARY_TEXT,
  },

  /**
   * b2 - Body Text 2
   * Usage: Secondary body text for descriptions or supplementary information.
   */
  b2: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: FONT_SIZE.SM,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: PRIMARY_TEXT,
  },

  /**
   * caption - Caption
   * Usage: Captions or small informational text, such as labels or notes.
   */
  caption: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: FONT_SIZE.SM,
    lineHeight: 16,
    letterSpacing: 0.4,
    color: SECONDARY_TEXT, // Lighter color for less emphasis
  },

  /**
   * button - Button Text
   * Usage: Text displayed on buttons or clickable elements.
   */
  button: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: FONT_SIZE.MD,
    lineHeight: 20,
    letterSpacing: 0.75,
    color: '#FFFFFF', // White for high contrast on buttons
  },
};

export default TYPOGRAPHY;
