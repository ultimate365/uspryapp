import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import Indicator from '../components/Indicator';
import {useGlobalContext} from '../context/Store';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  AppURL,
  appVersion,
  SCHOOL_SPLASH_BENGALINAME,
} from '../modules/constants';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Splash = () => {
  const AnimatedImageBg = Animated.createAnimatedComponent(ImageBackground);
  const {setState} = useGlobalContext();
  const navigation = useNavigation();
  const [showText, setShowText] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const logoImage = useSharedValue(0);
  const bgImage = useSharedValue(0);
  const gerua = useSharedValue(-responsiveWidth(100));
  const white = useSharedValue(responsiveWidth(100));
  const green = useSharedValue(-responsiveWidth(100));

  const animateSplash = () => {
    bgImage.value = withSpring(1, {duration: 2000});
    setTimeout(() => {
      logoImage.value = withSpring(1, {duration: 1000});
      setTimeout(() => {
        setShowText(true);
        gerua.value = withSpring(responsiveWidth(0), {duration: 500});
        setTimeout(() => {
          white.value = withSpring(responsiveWidth(0), {duration: 500});
          setTimeout(() => {
            green.value = withSpring(responsiveWidth(0), {duration: 500});
            setTimeout(() => {
              setShowLoader(true);
              getDetails();
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 1000);
  };

  const getDetails = async () => {
    const userDetails = JSON.parse(await EncryptedStorage.getItem('user'));
    const loggedAt = parseInt(await EncryptedStorage.getItem('loggedAt'));
    const userType = await EncryptedStorage.getItem('userType');
    try {
      await firestore()
        .collection('appUpdate')
        .get()
        .then(async snapshot => {
          const data = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))[0];
          if (data.update) {
            if (data.appVersion <= appVersion) {
              if (userDetails != null) {
                if ((Date.now() - loggedAt) / 1000 / 60 / 15 < 1) {
                  setState({
                    USER: userDetails,
                    ACCESS: userDetails.userType,
                    LOGGEDAT: loggedAt,
                    USERTYPE: userType,
                  });
                  console.log('User Not Logged');
                  setTimeout(() => {
                    setShowLoader(false);
                    navigation.navigate('Home');
                  }, 1000);
                } else {
                  console.log('User Logged');
                  setState({
                    USER: userDetails,
                    ACCESS: userDetails.userType,
                    LOGGEDAT: loggedAt,
                    USERTYPE: userType,
                  });

                  console.log('User Settled going to Home Page');
                  setTimeout(() => {
                    setShowLoader(false);
                    navigation.navigate('Home');
                  }, 1000);
                }
              } else {
                setTimeout(async () => {
                  setShowLoader(false);
                  navigation.navigate('Home');
                  console.log('User Not Settled going to Home Page');
                }, 1000);
              }
            } else {
              setShowModal(true);
            }
          } else {
            setShowModal(true);
          }
        })
        .catch(e => {
          setShowLoader(false);
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    animateSplash();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: THEME_COLOR,
      }}>
      <AnimatedImageBg
        source={require('../assets/images/spbg.jpg')}
        style={[styles.bgStyle, {opacity: bgImage}]}>
        <Animated.Image
          source={require('../assets/images/logo.png')}
          style={{
            width: responsiveWidth(80),
            height: responsiveWidth(80),
            alignSelf: 'center',
            transform: [{scale: logoImage}],
            marginTop: responsiveHeight(2),
          }}
        />
        {!showModal ? (
          <View>
            {showText && (
              <Animated.View>
                <Animated.Text
                  style={[styles.splashText, {left: gerua, color: '#FB7C24'}]}>
                  {SCHOOL_SPLASH_BENGALINAME[0]}
                </Animated.Text>
                <Animated.Text
                  style={[styles.splashText, {left: white, color: '#fff'}]}>
                  {SCHOOL_SPLASH_BENGALINAME[1]}
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.splashText,
                    {
                      bottom: green,
                      color: 'darkgreen',
                      textShadowColor: 'white',
                    },
                  ]}>
                  {SCHOOL_SPLASH_BENGALINAME[2]}
                </Animated.Text>
              </Animated.View>
            )}
          </View>
        ) : (
          <Modal animationType="slide" visible={showModal} transparent>
            <View style={styles.modalView}>
              <View style={styles.mainView}>
                <Text
                  selectable
                  style={{
                    fontSize: responsiveFontSize(3),
                    fontWeight: '500',
                    textAlign: 'center',
                    color: THEME_COLOR,
                  }}>
                  Your App Has a New Update
                </Text>
                <Text selectable style={styles.label}>
                  Please Download and Install the latest version of the app to
                  enjoy all the features.
                </Text>
                <CustomButton
                  title={'Download Now'}
                  color={'darkgreen'}
                  onClick={async () => {
                    const supported = await Linking.canOpenURL(AppURL); //To check if URL is supported or not.
                    if (supported) {
                      await EncryptedStorage.clear();
                      await Linking.openURL(AppURL); // It will open the URL on browser.
                    } else {
                      Alert.alert(`Can't open this URL: ${AppURL}`);
                    }
                  }}
                />
                <TouchableOpacity
                  style={{
                    marginTop: responsiveHeight(2),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => RNExitApp.exitApp()}>
                  <MaterialCommunityIcons
                    name="power"
                    size={responsiveFontSize(4)}
                    color={'red'}
                  />
                  <Text selectable style={{color: 'red', fontWeight: 'bold'}}>
                    Exit App
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        <View
          style={{
            marginVertical: responsiveHeight(1),
            width: responsiveFontSize(40),
            height: responsiveWidth(40),
          }}>
          {showLoader && !showModal && (
            <Indicator pattern={'UIActivity'} color={'white'} />
          )}
        </View>
      </AnimatedImageBg>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  splashText: {
    fontSize: responsiveFontSize(7),
    // fontWeight: '500',
    color: 'navy',
    fontFamily: 'sho',
    textShadowColor: 'navy',
    textShadowOffset: {
      width: responsiveWidth(0.5),
      height: responsiveWidth(0.5),
    },
    textShadowRadius: responsiveWidth(1),
    textAlign: 'center',
  },
  bgStyle: {
    alignSelf: 'center',
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
