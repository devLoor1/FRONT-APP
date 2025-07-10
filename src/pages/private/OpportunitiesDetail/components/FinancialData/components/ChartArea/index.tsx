import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createContainer,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTooltip,
} from 'victory-native';
import { useCustomStyles } from './style';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '~/context/MyThemeContext';
import { FlyoutComponent } from '~/components/FlyoutComponent';
import moment from 'moment';
import CommonMask from '~/helpers/masks';
import { EventPropTypeInterface, VictoryStyleInterface } from 'victory-core';
import LoadingComp from '~/components/Loading';
import CustomBar from './components/CustomBar';

type DataType =
  | {
    x: number;
    y: number;
    date: string;
    stub?: boolean;
  }[]
  | undefined;

type SelectMonthsType =
  | {
    qtd?: number;
    txt: string;
  }[]
  | undefined;

type ChartType = {
  setSelectedDebt: React.Dispatch<React.SetStateAction<number>>;
  selectedDebt: number;
  formatDate(value?: string, range?: string): void;
  date: string;
  chartColor: string;
  activeColor?: string;
  arrData: {
    date: string;
    value: number;
  }[];
  tooltipText?: string;
};

const listMonths = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];
const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

const BAR_WIDTH = 24;

export default function ChartArea({
  setSelectedDebt,
  selectedDebt,
  formatDate,
  date,
  arrData,
  chartColor,
  activeColor,
  tooltipText,
}: ChartType) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [data, setData] = useState<DataType>(undefined);
  const [qtd, setQtd] = useState<number | undefined>(arrData.length);
  const [selectMonths, setSelectMonths] = useState<SelectMonthsType>(undefined);
  const [chartWidth, setChartWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleArea, setVisibleArea] = useState({ x: 0, y: 0 });
  const { coord, selectedData, setCoord, setSelectedData } = FlyoutComponent.usePressEvent();
  const scrollRef = useRef<ScrollView>(null);

  function createData() {
    let newArr: DataType = [];
    const newMonths: string[] = [];
    let maxY = 0;
    let quarter = Math.round(arrData.length / 4);

    for (let index = 0; index < arrData.length; index++) {
      const el = arrData[index];
      maxY = el.value > maxY ? el.value : maxY;

      newArr.push({
        x: index, // index fixo
        y: el.value,
        date: el.date,
      });

      if (
        index === 0 ||
        index === arrData.length - 1 ||
        index === quarter - 1 ||
        index === quarter + quarter
      ) {
        const lastDate: string[] = el.date.split('/');
        newMonths.push(listMonths[+lastDate[0] - 1] + '/' + lastDate[1]);
      }
    }

    if (newArr.length > 0) {
      newArr = [
        { x: -1, y: 0, date: '', stub: true }, // inicio
        ...newArr,
        { x: newArr.length, y: 0, date: '', stub: true }, // fim
      ];
      formatDate(undefined, 'Todo o período');
      setSelectedDebt(newArr.reduce((acc, curr) => acc + curr.y, 0));
    }

    setData(newArr);
  }

  function filterData(qtd: number) {
    setLoading(true);
    let newArray = [];
    for (let i = arrData.length - 1; i >= 0; i--) {
      newArray.push(arrData[i]);
    }
    const sliceArr = newArray.slice(0, qtd);
    newArray = [];

    for (let i = sliceArr.length - 1; i >= 0; i--) {
      newArray.push(sliceArr[i]);
    }

    let newArr: DataType = [];
    const newMonths: string[] = [];
    let maxY = 0;
    let quarter = Math.round(qtd / 4);

    for (let index = 0; index < qtd; index++) {
      const el = newArray[index];
      if (!el) continue;
      maxY = el.value > maxY ? el.value : maxY;
      newArr.push({
        x: index,
        y: el.value,
        date: el.date,
      });

      if (
        index === 0 ||
        index === qtd - 1 ||
        index === quarter - 1 ||
        index === quarter + quarter
      ) {
        const lastDate: string[] = el.date.split('/');
        newMonths.push(listMonths[+lastDate[0] - 1] + '/' + lastDate[1]);
      }
    }

    if (newArr.length > 0) {
      newArr = [
        { x: -1, y: 0, date: '', stub: true },
        ...newArr,
        { x: newArr.length, y: 0, date: '', stub: true },
      ];
    }

    formatDate(undefined, `Últimos ${qtd} meses`);
    setSelectedDebt(newArr.reduce((acc, curr) => acc + curr.y, 0));

    setData(newArr);
    setLoading(false);
    setCoord(undefined);
    setSelectedData(undefined);
  }

  function listSelectMonths() {
    const newSelectMonths: SelectMonthsType = [];

    arrData.forEach((_el, index) => {
      if (index % 6 === 0 && index !== 0) {
        newSelectMonths.push({
          qtd: index,
          txt: index + 'M',
        });
      }
    });

    newSelectMonths.push({
      qtd: arrData.length,
      txt: 'Máximo',
    });

    setSelectMonths(newSelectMonths);
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    setVisibleArea({ x: contentOffset.x, y: contentOffset.y });
    setChartWidth(contentOffset.x + layoutMeasurement.width);
  }

  const barStyle: VictoryStyleInterface = {
    data: {
      width: 24,
      fill: chartColor,
      fillOpacity: ({ datum }) =>
        selectedData === undefined ? 1 : false || datum.x === selectedData.x ? 1 : 0.3,
    },
  };

  const calcWidth = useMemo(() => {
    if (!data) return 0;
    if (data.length < 12) {
      for (let i = data.length - 1; i < 12; i++) {
        const el = data[i];
        data.push({
          x: i,
          y: 0,
          date: el.date,
          stub: true,
        });
      }
    }

    return data.length * (BAR_WIDTH + 2);
  }, [data]);

  const pressEvent: EventPropTypeInterface<any, any>[] = [
    {
      target: 'data',
      eventHandlers: {
        onPressIn: (_, { x, y, datum }) => {
          setCoord(Platform.select({ ios: visibleArea, default: { x, y } }));
          setSelectedData(datum);
        },
      },
    },
  ];

  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [calcWidth]);

  useEffect(() => {
    listSelectMonths();
    createData();
  }, []);

  useEffect(() => {
    if (selectedData) {
      if (selectedData.y !== selectedDebt) setSelectedDebt(selectedData.y);
      if (selectedData.date !== date) formatDate(selectedData.date);
    } else {
      formatDate(undefined, `Últimos ${qtd} meses`);
      setSelectedDebt(data?.reduce((acc, curr) => acc + curr.y, 0) || 0);
    }
  }, [coord, data, date, qtd, selectedData, selectedDebt]);

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={{ height: 186, width: '100%' }}>
          <LoadingComp transparent />
        </View>
      )}
      <View style={{ flex: 1, width: '100%' }}>
        {!!data && !!data.length && !loading ? (
          <>
            <ScrollView
              horizontal
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              scrollToOverflowEnabled={false}
              bounces={false}
              alwaysBounceVertical={false}
              overScrollMode="never"
              style={{ marginBottom: 8, flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              onScroll={onScroll}
              onLayout={e => setChartWidth(e.nativeEvent.layout.width)}
              onContentSizeChange={() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              }}
            >
              {!!chartWidth ? (
                <VictoryChart
                  height={186}
                  width={calcWidth}
                  padding={{ bottom: 32 }}
                  domainPadding={{ y: 6 }}
                  scale={{ x: 'linear' }}
                  containerComponent={
                    // @ts-expect-error 'VictoryZoomVoronoiContainer' cannot be used as a JSX component. (victory-native bug)
                    <VictoryZoomVoronoiContainer
                      allowZoom={false}
                      allowPan={false}
                      zoomDimension="x"
                      voronoiDimension="x"
                    // zoomDomain={zoomDomain}
                    />
                  }
                  events={[
                    {
                      target: 'parent',
                      eventHandlers: {
                        onPressIn: () => {
                          setSelectedData(undefined);
                          setCoord(undefined);
                        },
                      },
                    },
                  ]}>
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        fontSize: 6,
                        padding: 12,
                        fill: theme.customColors.neutrals[300],
                        fontFamily: theme.fonts.regular,
                        angle: -45,
                        textAnchor: 'middle',
                      },
                      axis: { stroke: theme.customColors.neutrals[300] },
                    }}
                    axisValue={data.map(item => item.x)}
                    tickValues={data.filter(i => !i.stub).map(i => i.x)}
                    tickFormat={(t) => {
                      const item = data.find(d => d.x === t);
                      return item
                        ? moment(item.date, 'MM/YYYY').format('MMM/YY').toUpperCase()
                        : '';
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{ axis: { stroke: 'transparent' }, tickLabels: { fill: 'transparent' } }}
                  />
                  <VictoryBar
                    animate={false}
                    style={barStyle}
                    data={data}
                    x="x"
                    y="y"
                    labels={() => ''}
                    labelComponent={
                      <VictoryTooltip
                        renderInPortal={false}
                        x={coord?.x || 0}
                        y={coord?.y || 0}
                        flyoutComponent={
                          <BillingFlyoutComponent
                            chartHeight={186 - 36}
                            chartWidth={chartWidth}
                            data={selectedData}
                            textDesc={tooltipText}
                            {...coord}
                          />
                        }
                      />
                    }
                    dataComponent={<CustomBar />}
                    events={pressEvent}
                  />
                </VictoryChart>
              ) : (
                <></>
              )}
            </ScrollView>

            <View style={styles.selectList}>
              {selectMonths ? (
                selectMonths.map(month => (
                  <TouchableOpacity
                    style={{
                      ...styles.selectItem,
                      backgroundColor:
                        month.qtd === qtd
                          ? activeColor || theme.customColors.secondary[100]
                          : 'transparent',
                    }}
                    key={month.txt}
                    onPress={() => {
                      if (month.qtd !== qtd) {
                        setQtd(month.qtd);
                        filterData(month.qtd || arrData.length);
                      }
                    }}>
                    <Text
                      style={{
                        ...styles.selectTxt,
                        color:
                          month.qtd === qtd
                            ? theme.customColors.baseBlack
                            : theme.customColors.neutrals[600],
                      }}>
                      {month.txt}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <></>
              )}
            </View>
          </>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const BillingFlyoutComponent: React.FC<
  Partial<{
    chartWidth: number;
    chartHeight: number;
    x: number;
    y: number;
    textDesc?: string;
    data: { x: number; y: number; date: string };
  }>
> = ({ data, textDesc = '', ...rest }) => {
  const styles = useCustomStyles();
  if (!data) return null;
  return (
    <FlyoutComponent {...rest}>
      <Text style={styles.flyoutTitle}>
        Mês de{' '}
        {moment(data.x)
          .locale('pt')
          .format('MMMM/YYYY')
          .replace(/^./, match => match.toUpperCase())}
      </Text>
      <Text style={styles.flyoutDescription}>
        {textDesc}: R$ {CommonMask.currency(Number(data.y).toFixed(2).toString() || '')}
      </Text>
    </FlyoutComponent>
  );
};
