import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import moment from "moment";

import { ThumbsProps } from "@/models-old/types/Thumbs";
import { useCustomStyles } from "./style";
import { useTheme } from "@/context/MyThemeContext";
import CommonMask from "@/helpers/masks";
import BtnDefault from "@/components/BtnDefault";
import BackToTop from "@/components/BackToTop";
import SiteIcon from "@/../assets/newSvgs/icons/language.svg";
import LocationIcon from "@/../assets/newSvgs/icons/distance.svg";
import InstagramIcon from "@/../assets/newSvgs/icons/instagram.svg";
import FacebookIcon from "@/../assets/newSvgs/icons/facebook.svg";
import WarnIcon from "@/../assets/newSvgs/icons/brightness_alert.svg";
import PlayIcon from "@/../assets/newSvgs/icons/smart_display.svg";
import HelpIcon from "@/../assets/newSvgs/icons/forum.svg";

import { Analytics } from "@/helpers/analytics";
// import GalleryComp from "@/components/Gallery";
import WarrantiesDescription from "@/components/WarrantiesDescription";
import ApartmentIcon from "@/../assets/newSvgs/icons/apartment.svg";
import {
  OpportunityDetails,
  ResourceUtilization,
} from "@/models/opportunities/opportunityDetails.response";
import { usePlatformTerminology } from "@/features/platform-app/usePlatformTerminology";
import { usePlatformAppAuthenticatedContent } from "@/features/platform-app/usePlatformAppAuthenticatedContent";

type GeneralType = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  opportunity: OpportunityDetails;
};

export default function GeneralInfos({ setPage, opportunity }: GeneralType) {
  const content = usePlatformAppAuthenticatedContent().opportunities;
  const { resolveTerminology } = usePlatformTerminology();
  const investorsLabel = resolveTerminology(
    "investorRole.label.plural",
    "Investidores",
  );
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [showToUp, setShowToUp] = useState(false);
  const refPage = useRef<ScrollView>(null);
  const participationLabel =
    typeof opportunity.modality_data.participation === "number"
      ? `${CommonMask.percent(
          opportunity.modality_data.participation.toString(),
        )}%`
      : opportunity.modality_data.participation;

  const [foundation, setFoundation] = useState("");
  const [thumbs, setThumbs] = useState<ThumbsProps>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const refRBSheet = useRef<any>(null);

  function getTopScroll(e: any) {
    const offset = e.nativeEvent.contentOffset.y;
    if (offset > 350) {
      setShowToUp(true);
    } else {
      setShowToUp(false);
    }
  }

  function parseOrReturnOriginal(cnae: string): any {
    try {
      return JSON.parse(cnae);
    } catch {
      return cnae;
    }
  }

  const getParseCnae = (cnae: string = "") => {
    if (!cnae) return [];
    const cnaeParse = parseOrReturnOriginal(cnae);
    return cnaeParse ?? cnae;
  };

  const CnaePrincipalComponent = () => {
    /* if (typeof getParseCnae(opportunitieDetail?.cnae) === "string") {
      return (
        <Text style={{ ...styles.listItemDesc, textAlign: "left" }}>
          {getParseCnae(opportunitieDetail?.cnae)}.
        </Text>
      );
    }

    if (getParseCnae(opportunitieDetail?.cnae).length) {
      return getParseCnae(opportunitieDetail?.cnae).map(
        (item: any, index: number) => (
          <Text
            key={index}
            style={{ ...styles.listItemDesc, textAlign: "left" }}
          >
            {item}.
          </Text>
        )
      );
    } */

    return <></>;
  };

  const getResourceUtilization = (res: ResourceUtilization) => {
    switch (res) {
      case ResourceUtilization.InvestmentInTheOpportunity:
        return "Investimento na Oportunidade";
      default:
        return "";
    }
  };

  /* useEffect(() => {
    if (opportunitieDetail) {
      const newThumbs: ThumbsProps = [];
      if (opportunitieDetail.urlImages?.length) {
        opportunitieDetail.urlImages.forEach((img) => {
          newThumbs.push({
            thumb: img,
            type: "img",
          });
        });
      }

      if (opportunitieDetail.companyURLVideos?.length) {
        opportunitieDetail.companyURLVideos.forEach((video) => {
          newThumbs.push({
            thumb: video.urlThumbnail,
            type: "video",
            linkVideo: video.url,
          });
        });
      }

      setThumbs(newThumbs);
      const date = new Date(opportunitieDetail.dateFoundation);
      setFoundation(
        `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`
      );
    }
  }, [opportunitieDetail]); */

  return (
    <View style={{ flex: 1 }}>
      {opportunity && (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          onScroll={(e) => getTopScroll(e)}
          scrollEventThrottle={16}
          ref={refPage}
        >
          <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={styles.logo}>
                {opportunity.image ? (
                  <ImageBackground
                    source={{
                      uri: opportunity.image,
                    }}
                    resizeMode="contain"
                    style={styles.logo}
                  />
                ) : (
                  <ApartmentIcon
                    width={28}
                    height={28}
                    style={{
                      color: theme.dark
                        ? "#FFF"
                        : theme.customColors.neutrals[600],
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{opportunity.name}</Text>
                <Text style={styles.sector}>{opportunity.description}</Text>
                {/* <View style={styles.codesRow}>
                  <View
                    style={{
                      ...styles.code,
                      backgroundColor:
                        "#" + opportunity.ratingCor ||
                        theme.customColors.secondary.default,
                    }}
                  >
                    <Text style={styles.codeTxt}>
                      {opportunity.codeOpportunity}
                    </Text>
                  </View>
                  {opportunity.hasCashback && opportunity.cashback > 0 ? (
                    <View
                      style={{
                        ...styles.code,
                        backgroundColor: theme.customColors.warning.default,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.codeTxt,
                          color: theme.customColors.baseBlack,
                        }}
                      >
                        Cashback{" "}
                        {CommonMask.percent(
                          opportunity.cashback.toFixed(2).toString()
                        )}
                        %
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View> */}
              </View>
            </View>

            {/* <View style={{ marginTop: 16 }}>
              <WarrantiesDescription
                {...{
                  hasWarranty: opportunity.hasWarranty,
                  hasRepurchase: opportunity.hasRepurchase,
                  hasPropertyGuarantee: opportunity.hasPropertyGuarantee,
                }}
                warrantyTxt={opportunity.warranty}
                houseTxt={opportunity.propertyGuarantee}
                fontSize={12}
              />
            </View> */}

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Razão social</Text>
                <Text style={styles.listItemDesc}>
                  {opportunity.business_name}
                </Text>
              </View>
              {/* <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Data de fundação</Text>
                <Text style={styles.listItemDesc}>{foundation}</Text>
              </View> */}
              {/* <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>CNPJ</Text>
                <Text style={styles.listItemDesc}>
                  {CommonMask.cnpj(opportunity.cnpj || "")}
                </Text>
              </View> */}
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Colaboradores</Text>
                <Text style={styles.listItemDesc}>
                  {opportunity.members.length}
                </Text>
              </View>
              {/* <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Capital Social</Text>
                <Text style={styles.listItemDesc}>
                  R${" "}
                  {CommonMask.currency(
                    (opportunity.shareCapital || 0).toFixed(2).toString()
                  )}
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>
                  Faturamento dos últimos 12 meses
                </Text>
                <Text style={styles.listItemDesc}>
                  R${" "}
                  {CommonMask.currency(
                    (opportunity.annualBilling || 0).toFixed(2).toString()
                  )}
                </Text>
              </View> */}
              {/* {!!getParseCnae(opportunity.cnae)?.length && (
                <View
                  style={{
                    ...styles.listItem,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ ...styles.listItemTitle, marginBottom: 5 }}>
                    CNAE Principal
                  </Text>
                  <CnaePrincipalComponent />
                </View>
              )}
              {!!opportunity.secondaryCNAEs?.length && (
                <View
                  style={{
                    ...styles.listItem,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ ...styles.listItemTitle, marginBottom: 5 }}>
                    CNAE(s) Secundario(s)
                  </Text>
                  {Boolean(opportunity.secondaryCNAEs?.length) &&
                    opportunity.secondaryCNAEs?.map(
                      (item: any, index: number) => (
                        <Text
                          key={index}
                          style={{ ...styles.listItemDesc, textAlign: "left" }}
                        >
                          {item}.
                        </Text>
                      )
                    )}
                </View>
              )} */}
            </View>
            {/* <View style={styles.midias}>
              <View style={styles.midiasBlock}>
                <Text style={styles.siteName}>{opportunity.websiteUrl}</Text>
                <View style={styles.midiasRow}>
                  {opportunity.websiteUrl && (
                    <TouchableOpacity
                      onPress={() => {
                        Analytics({
                          eventName: "DetOportunidade_AbrirSiteEmpresa",
                        });
                        Linking.openURL(opportunity.websiteUrl || "");
                      }}
                    >
                      <SiteIcon color={theme.colors.text} />
                    </TouchableOpacity>
                  )}
                  {opportunity.localizacaoUrl && (
                    <TouchableOpacity
                      onPress={() => {
                        Analytics({ eventName: "DetOportunidade_AbrirMapa" });
                        Linking.openURL(opportunity.localizacaoUrl || "");
                      }}
                    >
                      <LocationIcon color={theme.colors.text} />
                    </TouchableOpacity>
                  )}
                  {opportunity.instagramUrl && (
                    <TouchableOpacity
                      onPress={() => {
                        Analytics({
                          eventName: "DetOportunidade_AbrirInstagram",
                        });
                        Linking.openURL(opportunity.instagramUrl || "");
                      }}
                    >
                      <InstagramIcon color={theme.colors.text} />
                    </TouchableOpacity>
                  )}
                  {opportunity.facebookUrl && (
                    <TouchableOpacity
                      onPress={() => {
                        Analytics({
                          eventName: "DetOportunidade_AbrirFacebook",
                        });
                        Linking.openURL(opportunity.facebookUrl || "");
                      }}
                    >
                      <FacebookIcon color={theme.colors.text} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View> */}
            {/* <View style={styles.blockBtnData}>
              <BtnDefault
                label="Ver dados financeiros"
                white
                onPress={() => {
                  Analytics({
                    eventName: "DetOportunidade_VerDadosFinanceiros",
                  });
                  setPage(2);
                }}
              />
            </View> */}
          </View>
          {!!opportunity.about && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sobre a oportunidade</Text>
              <Text style={styles.cardDesc}>{opportunity.about}</Text>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{content.detailProgressTitle}</Text>
            <View style={styles.cardList}>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Valor total</Text>
                <Text style={styles.listItemDesc}>
                  R${" "}
                  {CommonMask.currency(
                    (opportunity.goal.max_goal / 100).toFixed(2).toString()
                  )}
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>Captado</Text>
                <Text style={styles.listItemDesc}>
                  R${" "}
                  {CommonMask.currency(
                    (
                      (opportunity.goal.confirmed_payment +
                        opportunity.goal.unconfirmed_payment) /
                      100
                    )
                      .toFixed(2)
                      .toString()
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.dataBlock}>
              {/* <Text style={styles.progressTitle}>
                Financiado -{" "}
                {CommonMask.percent(
                  (
                    ((opportunity.qtdTotalCotas -
                      opportunity.qtdCotasDisponiveis) *
                      100) /
                    opportunity.qtdTotalCotas
                  )
                    .toFixed(1)
                    .toString()
                )}
                %
              </Text> */}
              <Text style={styles.progressTitle}>
                Captado -{" "}
                {CommonMask.percent(
                  (
                    opportunity.goal.confirmed_payment_percentage +
                    opportunity.goal.percentage_awaiting_payment
                  )
                    .toFixed(2)
                    .toString()
                )}
                %
              </Text>
              <View style={styles.progress}>
                <View
                  style={{
                    ...styles.progressFill,
                    backgroundColor: theme.customColors.secondary[400],
                    width: `${
                      opportunity.goal.confirmed_payment_percentage +
                      opportunity.goal.percentage_awaiting_payment
                    }%`,
                  }}
                />
                <View
                  style={{
                    ...styles.progressFill,
                    backgroundColor: theme.colors.primary,
                    width: `${opportunity.goal.confirmed_payment_percentage}%`,
                  }}
                />
              </View>
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Investimento mínimo:</Text>
              <Text style={styles.value}>
                R${" "}
                {CommonMask.currency(
                  (opportunity.monetary.min_investment_value / 100)
                    .toFixed(2)
                    .toString()
                )}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Meta mínima</Text>
              <Text style={styles.listItemDesc}>
                R${" "}
                {CommonMask.currency(
                  (opportunity.goal.min_goal / 100).toFixed(2).toString()
                )}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Meta máxima</Text>
              <Text style={styles.listItemDesc}>
                R${" "}
                {CommonMask.currency(
                  (opportunity.goal.max_goal / 100).toFixed(2).toString()
                )}
              </Text>
            </View>
            {typeof opportunity.total_investors === "number" && (
              <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>{investorsLabel}</Text>
                <Text style={styles.listItemDesc}>
                  {opportunity.total_investors}
                </Text>
              </View>
            )}
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>Encerramento</Text>
              <Text style={styles.listItemDesc}>
                {moment(opportunity.due_at).format("DD/MM/YYYY")}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>{content.detailResourcesLabel}</Text>
              <Text style={styles.listItemDesc}>
                {getResourceUtilization(opportunity.resource_utilization)}
              </Text>
            </View>
            <View style={styles.dataRow}>
              {opportunity.investor_profile?.title && (
                <View style={styles.dataItem}>
                  <Text style={styles.dataTitle}>{content.detailProfileLabel}</Text>
                  <Text style={styles.dataValue}>
                    {opportunity.investor_profile.title}
                  </Text>
                </View>
              )}
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Total investido</Text>
                <Text style={styles.dataValue}>
                  {CommonMask.percent(
                    opportunity.goal.confirmed_payment_percentage.toString()
                  )}
                  %
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataTitle}>Participação</Text>
                <Text style={styles.dataValue}>{participationLabel}</Text>
              </View>
            </View>
          </View>
          {/* {opportunity.loanReason && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Motivo da captação</Text>
              <Text style={styles.cardDesc}>{opportunity.loanReason}</Text>
            </View>
          )} */}
          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>Setor</Text>
            <Text style={styles.cardDesc}>{opportunity.sectorDescription}</Text>
          </View> */}
          {opportunity.members.length ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{content.detailTeamTitle}</Text>
              <FlatList
                horizontal
                style={{ marginHorizontal: -16 }}
                contentContainerStyle={styles.imagesRow}
                data={opportunity.members}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.imgBlock}
                    /* onPress={() => {
                      setGalleryIndex(index);
                      refRBSheet.current.open();
                    }} */
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={{
                        borderRadius: 8,
                        backgroundColor: theme.colors.background,
                      }}
                      width={40}
                      height={40}
                    />
                    <View style={styles.memberContainer}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberDesc}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            <></>
          )}
          {!!opportunity.promotional_video_url && (
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <BtnDefault
                white
                style={{ borderRadius: 8 }}
                icon={<PlayIcon color={theme.colors.primary} width={24} height={24} />}
                label="Vídeo da oportunidade"
                onPress={() => Linking.openURL(opportunity.promotional_video_url!)}
              />
            </View>
          )}
          {!!opportunity.whatsapp_group && (
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <BtnDefault
                white
                style={{ borderRadius: 8 }}
                icon={
                  <HelpIcon color={theme.colors.primary} width={24} height={24} />
                }
                label="Grupo do WhatsApp"
                onPress={() => Linking.openURL(opportunity.whatsapp_group!)}
              />
            </View>
          )}
        </ScrollView>
      )}
      {showToUp && <BackToTop scrollRef={refPage} />}
    </View>
  );

  // function renderContent() {
  //   return (
  //     <Container>
  //       <Content>
  //         <ProgressComp opportunitie={opportunitie} />
  //       </Content>
  //       <Content>
  //         <SectorComp
  //           setOpenGallery={setOpenGallery}
  //           setGalleryIndex={setGalleryIndex}
  //           thumbs={thumbs}
  //         />
  //       </Content>
  //     </Container>
  //   );
  // }
}
