import React, { useState, useMemo, PropsWithChildren } from 'react';
import { LayoutRectangle, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { G, ForeignObject, Polyline, Line } from 'react-native-svg';

import { useCustomStyles } from './style';
import { EventPropTypeInterface } from 'victory-core';

export const usePressEvent = () => {
  const [coord, setCoord] = useState<{ x: number; y: number }>();
  const [selectedData, setSelectedData] = useState<any>();
  const pressEvent: EventPropTypeInterface<any, any>[] = [
    {
      target: 'data',
      eventHandlers: {
        onPressIn: (_, { x, y, datum }) => {
          setCoord({ x, y });
          setSelectedData(datum);
        }
      },
    },
  ];

  return { pressEvent, coord, selectedData, setCoord, setSelectedData };
};

type FlyouComponentProps = React.FC<
  PropsWithChildren<
    Partial<{
      chartWidth: number;
      chartHeight: number;
      x: number;
      y: number;
    }>
  >
> & {
  usePressEvent: typeof usePressEvent;
};

export const FlyoutComponent: FlyouComponentProps = (() => {
  const Component: FlyouComponentProps = ({
    chartWidth = 0,
    chartHeight = 0,
    x = 0,
    y = 0,
    children,
  }) => {
    const styles = useCustomStyles();
    const [layout, setLayout] = useState<LayoutRectangle>();

    const constrainedY = useMemo(() => {
      if (!layout || !y) return undefined;
      if (y + layout.height > chartHeight) return y - (layout.height - (chartHeight - y)) - 10;
      return y;
    }, [layout, y]);

    const constrainedX = useMemo(() => {
      if (!layout || !x) return undefined;
      if (x + layout.width > chartWidth) return x - (layout.width - (chartWidth - x));
      return x;
    }, [layout, x]);

    if (!children) return null;

    if (Platform.OS === 'ios') {
      return (
        <Svg
          width={chartWidth}
          height={chartHeight}
          x={constrainedX}
          y={constrainedY}
        >
          <G>
            <Animated.View layout={FadeIn.delay(200)}>
              <Animated.View
                onLayout={e => {
                  setLayout(e.nativeEvent.layout);
                }}
                style={[styles.container, { opacity: constrainedX !== undefined ? 1 : 0 }]}>
                {children}
              </Animated.View>
            </Animated.View>
            {/* {constrainedX && constrainedY && (
              <Arrow
                x={x}
                boxX={constrainedX}
                boxWidth={layout?.width || 0}
                boxY={constrainedY + (layout?.height || 0)}
                fill={styles.container.backgroundColor}
                stroke={styles.container.borderColor}
              />
            )} */}
          </G>
        </Svg>
      )
    }

    return (
      <G>
        <ForeignObject x={constrainedX} y={constrainedY}>
          <Animated.View layout={FadeIn.delay(200)}>
            <Animated.View
              onLayout={e => {
                setLayout(e.nativeEvent.layout);
              }}
              style={[styles.container, { opacity: constrainedX !== undefined ? 1 : 0 }]}>
              {children}
            </Animated.View>
          </Animated.View>
        </ForeignObject>
        {constrainedX && constrainedY && (
          <Arrow
            x={x}
            boxX={constrainedX}
            boxWidth={layout?.width || 0}
            boxY={constrainedY + (layout?.height || 0)}
            fill={styles.container.backgroundColor}
            stroke={styles.container.borderColor}
          />
        )}
      </G>
    );
  };
  Component.usePressEvent = usePressEvent;
  return Component;
})();

type ArrowProps = {
  boxX: number; // X coordinate of the tooltip
  boxY: number; // Y coordinate of the tooltip
  boxWidth: number; // Tooltip width
  x: number; // X coordinate of the bar
  stroke: string;
  fill: string;
};

const Arrow: React.FC<ArrowProps> = ({ boxX, boxY, boxWidth, x, fill, stroke }) => {
  // Compute the arrow's origin (bottom center of the box)
  const arrowBaseX = boxX + boxWidth / 2;
  const arrowLength = 10;
  const borderWidth = 1;

  return (
    <Svg width={boxWidth} height="100">
      <Polyline
        points={`
          ${arrowBaseX - arrowLength} ${boxY - borderWidth},
          ${x} ${boxY + arrowLength},
          ${arrowBaseX + arrowLength} ${boxY - borderWidth}
          `}
        fill={fill}
        stroke={stroke}
      />
      <Line
        x1={arrowBaseX - arrowLength - borderWidth}
        y1={boxY - borderWidth * 2}
        x2={arrowBaseX + arrowLength + borderWidth}
        y2={boxY - borderWidth * 2}
        stroke={fill}
        strokeWidth={2}
      />
    </Svg>
  );
};
