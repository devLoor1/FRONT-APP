import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Steps from '../../../components/Steps';
import Onboarding1 from './components/Onboarding1';
import Onboarding2 from './components/Onboarding2';
import Onboarding3 from './components/Onboarding3';
import Opportunities from './components/Opportunities';
import { useCustomStyles } from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../../redux/hooks';
import { GetPublicOpportunities } from '@/services/onboarding';

export default function OnboardingPages() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const styles = useCustomStyles();

  useEffect(() => {
    (async () => {
      await dispatch(GetPublicOpportunities());
    })();
  }, []);

  function renderContent() {
    switch (page) {
      case 1:
        return <Onboarding1 setPage={setPage} />;
      case 2:
        return <Onboarding2 setPage={setPage} />;
      case 3:
        return <Onboarding3 setPage={setPage} />;
      case 4:
        return <Opportunities />;
      default:
        return <Onboarding1 setPage={setPage} />;
    }
  }
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Steps qtd={4} index={page} />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}
