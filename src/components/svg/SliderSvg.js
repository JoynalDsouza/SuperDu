import * as React from 'react';
import Svg, {
  Mask,
  Path,
  G,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SliderSvg(props) {
  const {fillColor = 'red', stroke = 'white'} = props;
  console.log(fillColor);
  return (
    <Svg
      width={90}
      height={76}
      viewBox="0 0 90 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask
        id="a"
        style={{
          maskType: 'alpha',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={90}
        height={76}>
        <Path fill="#D9D9D9" d="M0 0H90V76H0z" />
      </Mask>
      <G mask="url(#a)">
        <G filter="url(#filter0_d_3239_12831)">
          <Path
            d="M0 40.182h.224a22 22 0 0013.735-4.815l13.02-10.405c10.217-8.166 24.725-8.17 34.947-.011l12.057 9.622A25.676 25.676 0 0090 40.182V76H0V40.182z"
            fill="#25293D"
          />
        </G>
        <G filter="url(#filter1_d_3239_12831)">
          <Circle cx={45} cy={48} r={24} fill={fillColor} />
          <Circle
            cx={45}
            cy={48}
            r={21.4925}
            stroke={fillColor}
            strokeWidth={5.01496}
          />
        </G>
        <Path
          stroke="#3F3F3F"
          strokeWidth={1.67165}
          strokeLinecap="round"
          d="M38.9785 38.5502L38.9785 57.45"
        />
        <Path
          stroke="#3F3F3F"
          strokeWidth={1.67165}
          strokeLinecap="round"
          d="M45.8359 38.5502L45.8359 57.45"
        />
        <Path
          stroke="#3F3F3F"
          strokeWidth={1.67165}
          strokeLinecap="round"
          d="M52.6926 38.5502L52.6926 57.45"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_3239_12831"
          x1={45}
          y1={24}
          x2={45}
          y2={72}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#C3C3C3" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_3239_12831"
          x1={45}
          y1={24}
          x2={45}
          y2={72}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#CACACA" />
          <Stop offset={0.322518} stopColor="#F0F0F0" stopOpacity={0} />
          <Stop offset={0.530011} stopColor="#F0F0F0" stopOpacity={0} />
          <Stop offset={0.803581} stopColor="#EEE" stopOpacity={0} />
          <Stop offset={1} stopColor="#fff" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default SliderSvg;
