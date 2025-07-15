import "moment/locale/pt";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
/* import {
  createContainer,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTooltip,
} from "victory-native";
import {
  CallbackArgs,
  DomainTuple,
  VictoryStringOrNumberCallback,
  VictoryStyleInterface,
} from "victory-core";
import { VictoryBarProps } from "victory-bar/es"; */
import moment from "moment";

import { useCustomStyles } from "./style";
import { useTheme } from "@/context/MyThemeContext";
import BlurValues from "@/components/BlurValues";
import CommonMask from "@/helpers/masks";
import ArrowUp from "@/../assets/newSvgs/icons/arrow_upward_alt.svg";
import { useAppSelector } from "@/redux/hooks";
import { ReceivedInterestGraphResponse } from "@/models-old/investiment/receivedInterestGraph.response";
import { useCommon } from "@/context/CommonContext";
import { InterestFlyoutCompoment } from "./InterestFlyoutCompoment";
import { TouchableOpacity } from "react-native-gesture-handler";
import InfoIcon from "@/../assets/newSvgs/icons/info.svg";
import ModalDefault from "@/components/ModalDefault";
import { Rect } from "react-native-svg";

// const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

const CHART_HEIGHT = 192;

const MIN_BARS = 12;

const InterestChart: React.FC = () => {
  const { theme } = useTheme();
  const styles = useCustomStyles();
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedData, setSelectedData] = useState();
  const { graph } = useAppSelector((state) => state.wallet);
  const { showBalance } = useCommon();
  const [coord, setCoord] = useState<{ x: number; y: number }>();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [visibleArea, setVisibleArea] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<ScrollView>(null);

  const transformDataForStackedBarChart = (
    originalData: ReceivedInterestGraphResponse[]
  ) => {
    const data = [...originalData];
    /* 
      Added dummy bars in the beginning and in the end of the chart to fix a bug
      of victory native that happens when applying custom zoom domain.
    */
    const createDummyBar = (fn: "add" | "subtract", position: number) => {
      const x = moment(data[position].month)[fn](1, "month").toDate().getTime();
      return { x, invested: 0, interest: 0 };
    };

    if (data.length < MIN_BARS) {
      for (let i = data.length - 1; i < MIN_BARS; i++) {
        data.push({
          month: moment(data[i].month).add(1, "month").toDate(),
          invested: 0,
          interest: 0,
        });
      }
    }

    return [
      createDummyBar("subtract", 0),
      ...data.map((entry) => ({
        x: new Date(entry.month).getTime(),
        invested: entry.invested,
        interest: entry.interest,
      })),
      createDummyBar("add", data.length - 1),
    ];
  };

  const transformedData = useMemo(() => {
    if (graph && graph.length) return transformDataForStackedBarChart(graph);
  }, [graph]);

  const { total, interest, date } = useMemo(() => {
    if (selectedData !== undefined && transformedData)
      return {
        total:
          transformedData[selectedData].invested +
          transformedData[selectedData].interest,
        interest: transformedData[selectedData].interest,
        date: moment(transformedData[selectedData].x)
          .locale("pt")
          .format("MMMM [de] YYYY")
          .replace(/^./, (match) => match.toUpperCase()),
      };
    if (transformedData)
      return {
        total: transformedData.reduce(
          (acc, curr) => acc + curr.interest + curr.invested,
          0
        ),
        interest: transformedData.reduce((acc, curr) => acc + curr.interest, 0),
        date: "Todo o período",
      };
    return { total: 0, invested: 0, date: "Todo o período" };
  }, [selectedData, transformedData]);

  /* const domain: { x?: DomainTuple } = useMemo(() => {
    if (!transformedData) return {};

    return {
      x: [transformedData[0].x, transformedData[transformedData.length - 1].x],
    };
  }, [transformedData]);
  */
  const onLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    setVisibleArea({ x: contentOffset.x, y: contentOffset.y });
    setChartWidth(contentOffset.x + layoutMeasurement.width);
  }

  /* const fillOpacity = ({ index }: CallbackArgs) =>
    selectedData === undefined ? 1 : false || index === selectedData ? 1 : 0.3;

  const pressEvent: VictoryBarProps["events"] = [
    {
      target: "data",
      eventHandlers: {
        onPressIn: (_, { x, y, datum }) => {
          setCoord(Platform.select({ ios: visibleArea, default: { x, y } }));
          setSelectedData(datum._group);
        },
      },
    },
  ];

  const barStyle = (fill: string): VictoryStyleInterface => ({
    data: { width: 24, fill, fillOpacity },
    labels: {
      fill: theme.colors.text,
      fontFamily: theme.fonts.regular,
      fontSize: 12,
    },
  }); */

  useEffect(() => {
    if (transformedData && transformedData.length <= 15) {
      scrollRef.current?.scrollTo({ x: chartWidth, animated: false });
      return;
    }

    if (transformedData) scrollRef.current?.scrollToEnd({ animated: true });
  }, [transformedData]);

  if (!transformedData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Total recebido</Text>
          <BlurValues value={Number(total).toFixed(2).toString() || "0"} />
          <Text style={styles.itemTitle}>{date}</Text>
        </View>
        <View>
          <View style={styles.itemContainer}>
            <Text style={[styles.itemTitle, { textAlign: "right" }]}>
              Juros recebido
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalTitle("Juros recebido");
                setModalDesc("Juros recebido no período selecionado.");
                setShowModal(true);
              }}
            >
              <InfoIcon
                color={theme.customColors.hyperlink}
                width={12}
                height={12}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.itemValueContainer}>
            <Text style={styles.itemValue}>
              R${" "}
              {showBalance
                ? CommonMask.currency(
                    Number(interest)?.toFixed(2).toString() || ""
                  )
                : "-"}
            </Text>
            <ArrowUp
              width={12}
              height={12}
              color={theme.customColors.risk.default}
            />
          </View>
        </View>
      </View>
      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        scrollToOverflowEnabled={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        style={{ marginBottom: 8 }}
        contentContainerStyle={{ flexGrow: 1 }}
        onLayout={onLayout}
        onScroll={onScroll}
        onStartShouldSetResponder={() => true}
        onContentSizeChange={() => {
          if (transformedData && transformedData.length <= 15) {
            scrollRef.current?.scrollTo({ x: chartWidth, animated: false });
            return;
          }

          if (transformedData)
            scrollRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {/* {!!transformedData?.length && !!chartWidth && (
          <VictoryChart
            width={transformedData.length * (24 + 2)}
            height={CHART_HEIGHT}
            scale={{ x: "time" }}
            padding={{ bottom: 32 }}
            domainPadding={{ y: 6 }}
            domain={domain}
            containerComponent={
              // @ts-expect-error 'VictoryZoomVoronoiContainer' cannot be used as a JSX component. (victory-native bug)
              <VictoryZoomVoronoiContainer
                allowZoom={false}
                allowPan={false}
                zoomDimension="x"
                voronoiDimension="x"
                downsample={transformedData.length}
              />
            }
            events={[
              {
                target: "parent",
                eventHandlers: {
                  onPressIn: () => {
                    setSelectedData(undefined);
                    setCoord(undefined);
                  },
                },
              },
            ]}
          >
            <VictoryAxis
              style={{
                tickLabels: {
                  fontSize: 6,
                  padding: 12,
                  fill: theme.customColors.neutrals[300],
                  fontFamily: theme.fonts.regular,
                  angle: -45,
                  textAnchor: "middle",
                },
                axis: { stroke: theme.customColors.neutrals[300] },
              }}
              axisValue={transformedData.map((i) => i.x)}
              tickValues={transformedData
                .slice(1, transformedData.length - 1)
                .map((i) => i.x)}
              tickFormat={(t) =>
                moment(t).locale("pt").format("MMM/YY").toUpperCase()
              }
            />

            <VictoryAxis
              dependentAxis
              style={{ axis: { stroke: "transparent" } }}
            />

            <VictoryStack>
              <VictoryBar
                animate={false}
                data={transformedData}
                x="x"
                y="invested"
                barRatio={1}
                style={barStyle(theme.customColors.secondary[500])}
                events={pressEvent}
                labels={() => ""}
                dataComponent={<CustomBar field="invested" />}
                labelComponent={
                  <VictoryTooltip
                    renderInPortal={false}
                    x={coord?.x || 0}
                    y={coord?.y || 0}
                    flyoutComponent={
                      <InterestFlyoutCompoment
                        chartWidth={chartWidth}
                        chartHeight={CHART_HEIGHT - 36}
                        data={transformedData[selectedData || -1]}
                        {...coord}
                      />
                    }
                  />
                }
              />
              <VictoryBar
                animate={false}
                data={transformedData}
                x="x"
                y="interest"
                barRatio={1}
                style={barStyle(theme.customColors.secondary.default)}
                events={pressEvent}
                labels={() => ""}
                dataComponent={<CustomBar field="interest" />}
                labelComponent={
                  <VictoryTooltip
                    renderInPortal={false}
                    x={coord?.x || 0}
                    y={coord?.y || 0}
                    flyoutComponent={
                      <InterestFlyoutCompoment
                        chartWidth={chartWidth}
                        chartHeight={CHART_HEIGHT - 36}
                        data={transformedData[selectedData || -1]}
                        {...coord}
                      />
                    }
                  />
                }
              />
            </VictoryStack>
          </VictoryChart>
        )} */}
      </ScrollView>
      <View style={styles.legend}>
        <View style={styles.labelContainer}>
          <View
            style={[
              styles.labelDor,
              { backgroundColor: theme.customColors.secondary[500] },
            ]}
          />
          <Text style={styles.labelText}>Principal recebido</Text>
        </View>
        <View style={styles.labelContainer}>
          <View
            style={[
              styles.labelDor,
              { backgroundColor: theme.customColors.secondary.default },
            ]}
          />
          <Text style={styles.labelText}>Juros</Text>
        </View>
      </View>

      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title={modalTitle}
        desc={modalDesc}
      />
    </View>
  );
};

/* const CustomBar: React.FC<
  Partial<{
    x: number;
    y: number;
    scale: any;
    datum: { invested: number; interest: number };
    style: VictoryStyleInterface["data"];
    field: "interest" | "invested";
    events: any;
    index: number;
  }>
> = (props) => {
  const {
    x = 0,
    y = 0,
    scale,
    datum,
    style = {},
    field = "interest",
    events,
    index,
  } = props;
  if (!datum) return null;
  if (datum[field] === 0) return null;

  // Extend the bar height visually by modifying y and height
  const barHeight = scale.y(0) - scale.y(datum[field]);
  let extraHeight = 6;

  if (datum.invested > 0 && datum.interest > 0 && field === "invested")
    extraHeight = 0;

  return (
    <Rect
      x={x - (style.width as number) / 2}
      y={y - extraHeight}
      width={style.width as number}
      height={barHeight + extraHeight}
      fill={(style.fill as string) || "steelblue"}
      fillOpacity={(style.fillOpacity as VictoryStringOrNumberCallback)?.({
        index,
      })}
      onPressIn={() => {
        events?.onPressIn?.();
      }}
    />
  );
}; */

export default InterestChart;
