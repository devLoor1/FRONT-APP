import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  VictoryChart,
  VictoryArea,
  VictoryPolarAxis,
  VictoryLabel,
  VictoryTheme,
} from 'victory-native';
import { useTheme } from '~/context/MyThemeContext';
import { useAppSelector } from '~/redux/hooks';

type DataType =
  | {
      x: string;
      y: number;
    }[]
  | undefined;

const RadarChart = () => {
  const { ratingList } = useAppSelector(state => state.opportunitiePJ);
  const [data, setData] = useState<DataType>();
  const { theme } = useTheme();

  useEffect(() => {
    if (ratingList) {
      const newData: DataType = [];
      ratingList.pillars.forEach(item => {
        newData.push({
          x: item.pillarRating,
          y: item.value,
        });
      });

      setData(newData);
    }
  }, []);

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {data && (
        <VictoryChart
          polar
          domain={{ y: [ratingList?.intervalMin || 0, ratingList?.intervalMax || 5] }}
          theme={VictoryTheme.material}>
          {data.map((key, i) => {
            return (
              <VictoryPolarAxis
                key={i}
                dependentAxis
                style={{
                  axisLabel: {
                    padding: 15,
                    fill: theme.colors.text,
                    fontSize: 10,
                    fontFamily: theme.fonts.bold,
                  },
                  axis: { stroke: theme.dark ? theme.customColors.neutrals[600] : '#EFEFEF' },
                  grid: {
                    stroke: theme.dark ? theme.customColors.neutrals[600] : '#EFEFEF',
                    strokeWidth: 1,
                  },
                }}
                tickLabelComponent={
                  <VictoryLabel labelPlacement="perpendicular" style={{ display: 'none' }} />
                }
                labelPlacement="perpendicular"
                axisValue={i + 1}
                label={key.x}
              />
            );
          })}
          <VictoryPolarAxis
            labelPlacement="parallel"
            tickFormat={() => ''}
            style={{
              axis: { stroke: theme.dark ? theme.customColors.neutrals[600] : '#EFEFEF' },
              grid: {
                stroke: theme.dark ? theme.customColors.neutrals[600] : '#EFEFEF',
                opacity: 0.5,
              },
            }}
          />
          <VictoryArea
            data={data}
            style={{
              data: {
                fill: '#299DFE33',
                fillOpacity: 1,
                stroke: theme.customColors.secondary.default,
              },
            }}
          />
        </VictoryChart>
      )}
    </View>
  );
};

export default RadarChart;
