// theme.ts

/**
 * Primary Colors
 * Used for main backgrounds and primary text elements.
 */

// Charcoal Black: Primary background color for the app, providing a deep, neutral backdrop.
export const PRIMARY_BACKGROUND = '#121212';

// White Smoke: Primary text color on dark backgrounds, offering high contrast for readability.
export const PRIMARY_TEXT = '#E0E0E0';

/**
 * Secondary Colors
 * Highlight colors for interactive elements like buttons and links.
 */

// Dim Grey: Used for secondary text, placeholders, and less prominent elements.
export const SECONDARY_TEXT = '#696969';

/**
 * Tertiary Colors
 * Additional colors for specific purposes like success, warnings, and errors.
 */

/**
 * Charcoal Grey: Background color for cards, panels, and input fields to create visual hierarchy.
 */
export const SECONDARY_BACKGROUND = '#333333';

/**
 * Neutral Colors
 * Used for text and borders, providing subtle contrasts.
 */

// Graphite Grey: Text color for inactive or disabled items, maintaining a uniform look.
export const TERTIARY_TEXT = '#3A3A3A';

// Light Slate Grey: Used for borders and dividers between sections.
export const LIGHT_SLATE_GREY = '#778899';

/**
 * Accent Colors
 * Used to enhance visual elements such as charts and highlighted data.
 */

// Teal Blue: Accent color for charts, graphs, and highlighted data, adding a refreshing contrast.
export const TEAL_BLUE = '#20B2AA';

// Electric Blue: Used to highlight active elements such as buttons, links, and selected tabs.
export const ELECTRIC_BLUE = '#1E90FF';

// Success Green: Used for positive indicators like success messages and transaction confirmations.
export const SUCCESS_GREEN = '#28A745';

// Warning Amber: Used for warning messages and alerts, providing a distinct visual cue.
export const WARNING_AMBER = '#FFBF00';

// Error Red: Used for error messages, critical alerts, and delete actions.
export const ERROR_RED = '#FF6347';

export const VIVID_ORANGE = '#FF4500';
// Vivid Orange:

export const HOT_PINK = '#FF1493';
// Hot Pink:

const opacityHexMap = {
  '100': 'FF',
  '99': 'FC',
  '98': 'FA',
  '97': 'F7',
  '96': 'F5',
  '95': 'F2',
  '94': 'F0',
  '93': 'ED',
  '92': 'EB',
  '91': 'E8',
  '90': 'E6',
  '89': 'E3',
  '88': 'E0',
  '87': 'DE',
  '86': 'DB',
  '85': 'D9',
  '84': 'D6',
  '83': 'D4',
  '82': 'D1',
  '81': 'CF',
  '80': 'CC',
  '79': 'C9',
  '78': 'C7',
  '77': 'C4',
  '76': 'C2',
  '75': 'BF',
  '74': 'BD',
  '73': 'BA',
  '72': 'B8',
  '71': 'B5',
  '70': 'B3',
  '69': 'B0',
  '68': 'AD',
  '67': 'AB',
  '66': 'A8',
  '65': 'A6',
  '64': 'A3',
  '63': 'A1',
  '62': '9E',
  '61': '9C',
  '60': '99',
  '59': '96',
  '58': '94',
  '57': '91',
  '56': '8F',
  '55': '8C',
  '54': '8A',
  '53': '87',
  '52': '85',
  '51': '82',
  '50': '80',
  '49': '7D',
  '48': '7A',
  '47': '78',
  '46': '75',
  '45': '73',
  '44': '70',
  '43': '6E',
  '42': '6B',
  '41': '69',
  '40': '66',
  '39': '63',
  '38': '61',
  '37': '5E',
  '36': '5C',
  '35': '59',
  '34': '57',
  '33': '54',
  '32': '52',
  '31': '4F',
  '30': '4D',
  '29': '4A',
  '28': '47',
  '27': '45',
  '26': '42',
  '25': '40',
  '24': '3D',
  '23': '3B',
  '22': '38',
  '21': '36',
  '20': '33',
  '19': '30',
  '18': '2E',
  '17': '2B',
  '16': '29',
  '15': '26',
  '14': '24',
  '13': '21',
  '12': '1F',
  '11': '1C',
  '10': '1A',
  '9': '17',
  '8': '14',
  '7': '12',
  '6': '0F',
  '5': '0D',
  '4': '0A',
  '3': '08',
  '2': '05',
  '1': '03',
  '0': '00',
};

export const applyOpacityToHexColor = (
  color: string,
  opacity: string | number,
) => {
  const hexOpacity = opacityHexMap[opacity.toString()];
  return `${color}${hexOpacity || 'FF'}`;
};
