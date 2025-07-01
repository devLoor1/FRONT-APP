import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import { MyThemeProvider } from './context/MyThemeContext';
import Routes from './routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <MyThemeProvider>
          <Routes />
        </MyThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
