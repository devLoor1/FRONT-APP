import { Rect } from 'react-native-svg';
import { VictoryStyleInterface, VictoryStringOrNumberCallback } from 'victory-core';

const CustomBar: React.FC<
  Partial<{
    x: number;
    y: number;
    scale: any;
    datum: { x: number; y: number };
    style: VictoryStyleInterface['data'];
    events: any;
    index: number;
  }>
> = props => {
  const { x = 0, y = 0, scale, datum, style = {}, events } = props;
  if (!datum) return null;
  if (datum.y === 0) return null;

  // Extend the bar height visually by modifying y and height
  const barHeight = scale.y(0) - scale.y(datum.y);
  let extraHeight = 6;

  return (
    <Rect
      x={x - (style.width as number) / 2}
      y={y - extraHeight}
      width={style.width as number}
      height={barHeight + extraHeight}
      fill={(style.fill as string) || 'steelblue'}
      fillOpacity={(style.fillOpacity as VictoryStringOrNumberCallback)?.({ datum })}
      onPressIn={() => {
        events?.onPressIn?.();
      }}
    />
  );
};

export default CustomBar;
