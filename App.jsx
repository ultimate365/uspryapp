import {
  View,
  LogBox,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GlobalContextProvider} from './src/context/Store';
import {THEME_COLOR} from './src/utils/Colors';
import Toast from 'react-native-toast-message';
LogBox.ignoreAllLogs();
const App = () => {
  return (
    <GlobalContextProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <StatusBar backgroundColor={THEME_COLOR} barStyle={'light-content'} />
          <GestureHandlerRootView style={{flex: 1}}>
            <KeyboardAvoidingView style={{flex: 1}}>
              <AppNavigator />
              <Toast />
            </KeyboardAvoidingView>
          </GestureHandlerRootView>
        </View>
      </SafeAreaView>
    </GlobalContextProvider>
  );
};

export default App;
