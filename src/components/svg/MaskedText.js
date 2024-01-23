import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

const MaskedText = () => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 800 300">
      <Defs>
        <LinearGradient
          id="Gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="800"
          y2="0">
          <Stop offset="0" stopColor="white" stopOpacity="0" />
          <Stop offset="1" stopColor="white" stopOpacity="1" />
        </LinearGradient>
        <Mask
          id="Mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="800"
          height="300">
          <Rect x="0" y="0" width="800" height="300" fill="url(#Gradient)" />
        </Mask>
        <Text
          id="Text"
          x="400"
          y="200"
          //   fontFamily="Verdana"
          fontSize="100"
          textAnchor="middle">
          Masked text
        </Text>
      </Defs>
      <Rect x="0" y="0" width="800" height="300" fill="#FF8080" />
      <Use href="#Text" fill="blue" mask="url(#Mask)" />
      <Use href="#Text" fill="none" stroke="black" stroke-width="2" />
    </Svg>
  );
};

export default MaskedText;
