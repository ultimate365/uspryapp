import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Alert,
  Switch,
  BackHandler,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import {ADMISSION_STATUS, classWiseAge, WEBSITE} from '../modules/constants';
import {showToast} from '../modules/Toaster';
import {
  DateValueToSring,
  getCurrentDateInput,
  uniqArray,
} from '../modules/calculatefunctions';

export default function ViewAdmission() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {state, setStateObject, setActiveTab} = useGlobalContext();
  const access = state?.ACCESS;
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [applicationYear, setApplicationYear] = useState([]);
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [showData, setShowData] = useState(false);
  const [admissionStatus, setAdmissionStatus] = useState(true);
  const statusID = ADMISSION_STATUS;

  const calculateAge = (inputDate, students_class) => {
    const birthDate = new Date(inputDate);
    const today = new Date();

    const month = today.getMonth() + 1;
    let year = today.getFullYear();
    if (month > 3) {
      year = year + 1;
    } else {
      year = year;
    }

    const referenceDate = new Date(`${year}-01-01`);

    // Calculate the difference in years, months, and days
    let years = referenceDate.getFullYear() - birthDate.getFullYear();
    let months = referenceDate.getMonth() - birthDate.getMonth();
    let days = referenceDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        0,
      ); // Get the last day of the previous month
      days += lastMonth.getDate(); // Add the days from the last month
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    const validAge = classWiseAge.filter(
      item => item.className === students_class,
    )[0].age;
    let ageMessage;
    if (validAge === years) {
      ageMessage = `Student is Valid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    } else {
      ageMessage = `Student is Invalid (${validAge}Yrs), age is ${years} years, ${months} months, and ${days} days.`;
    }
    return ageMessage;
  };

  const getData = async () => {
    setLoader(true);
    try {
      await firestore()
        .collection('admission')
        .get()
        .then(async snapshot => {
          const data = snapshot.docs
            .map(doc => ({
              ...doc.data(),
              id: doc.id,
            }))
            .sort(
              (a, b) =>
                b.student_addmission_dateAndTime -
                a.student_addmission_dateAndTime,
            );
          setAllData(data);
          setFilteredData(data);
          let x = [];
          const getYears = data.map(entry => {
            return (x = [...x, entry.student_addmission_year]);
          });
          await Promise.all(getYears).then(() => {
            x = uniqArray(x);
            x = x.sort((a, b) => b - a);
            setApplicationYear(x);
            setLoader(false);
          });
        });
    } catch (error) {
      console.error('Error getting documents: ', error);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };

  const getAdmissionStatus = async () => {
    setLoader(true);
    try {
      await firestore()
        .collection('admissionStatus')
        .where('id', '==', statusID)
        .get()
        .then(async snapShot => {
          const data = snapShot.docs[0]._data;
          setAdmissionStatus(data?.status);
          if (data?.status) {
            showToast('success', 'Admission is Open');
          } else {
            showToast('error', 'Admission is Closed');
          }
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
          showToast('error', e);
        });
    } catch (error) {
      showToast('error', 'Admission Not Found!');
      setLoader(false);
      console.log(error);
    }
  };
  const changeAdmissionStatus = async status => {
    setLoader(true);
    try {
      await firestore()
        .collection('admissionStatus')
        .doc(statusID)
        .update({status})
        .then(() => {
          if (status) {
            showToast('success', 'Admission Window Opend Successfully!');
          } else {
            showToast('success', 'Admission Window Closed Successfully!');
          }
          setLoader(false);
        })
        .catch(err => {
          console.error('Error updating document: ', err);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (error) {
      console.error('Error updating document: ', error);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const delEntry = async entry => {
    setLoader(true);
    await firestore()
      .collection('admission')
      .doc(entry.id)
      .delete()
      .then(async () => {
        await storage()
          .ref('/studentImages/' + entry?.photoName)
          .delete()
          .then(() => {
            showToast('success', 'Application Deleted successfully');
            getData();
            setLoader(false);
          })
          .catch(e => {
            showToast('error', 'Failed to delete image');
            setLoader(false);
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
        showToast('error', 'Failed to delete Application');
      });
  };
  const showConfirmDialog = entry => {
    return Alert.alert('Hold On!', 'Are You Sure? This Entry Will be Deleted', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Cancel',
        onPress: () => showToast('success', 'Student Not Deleted'),
      }, // The "Yes" button
      {
        text: 'Yes',
        onPress: async () => {
          await delEntry(entry);
        },
      },
    ]);
  };
  useEffect(() => {
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    }
    getData();
    getAdmissionStatus();
  }, [isFocused]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home');
        setActiveTab(0);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}>
        <Loader visible={loader} />
        <Text style={styles.title}>View Admission</Text>
        <CustomButton
          title={'Add / Edit Entry'}
          size={'medium'}
          fontSize={responsiveFontSize(1.5)}
          color={'blueviolet'}
          onClick={() => {
            navigation.navigate('Home');
            setActiveTab(3);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: responsiveHeight(1),
          }}>
          <Text
            selectable
            style={[
              styles.title,
              {
                paddingRight: responsiveWidth(1.5),
                fontSize: responsiveFontSize(2),
              },
            ]}>
            Close Admission
          </Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={admissionStatus ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setAdmissionStatus(prev => !prev);
              changeAdmissionStatus(!admissionStatus);
            }}
            value={admissionStatus}
          />

          <Text
            selectable
            style={[
              styles.title,
              {paddingLeft: 5, fontSize: responsiveFontSize(2)},
            ]}>
            Open Admission
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: responsiveHeight(1),
            flexWrap: 'wrap',
            alignSelf: 'center',
          }}>
          <Text style={styles.title}>Admission Application Data</Text>
          {applicationYear.map((year, index) => {
            return (
              <CustomButton
                title={year}
                size={'small'}
                onClick={() => {
                  let x = allData.filter(
                    entry => entry.student_addmission_year === year,
                  );
                  setFilteredData(x);
                  setShowData(true);
                  setYear(year);
                  setSearch('');
                }}
                key={index}
              />
            );
          })}
        </View>
        {showData && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: responsiveHeight(1),
              flexWrap: 'wrap',
              alignSelf: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveHeight(1),
                flexWrap: 'wrap',
                alignSelf: 'center',
              }}>
              <Text style={styles.title}>{`Year: ${year}`}</Text>
              <CustomTextInput
                value={search}
                placeholder="Search"
                onChangeText={text => {
                  setSearch(text);
                  if (text) {
                    let x = allData.filter(
                      entry => entry.student_addmission_year === year,
                    );
                    x = x.filter(entry =>
                      entry.student_eng_name
                        .toLowerCase()
                        .match(text.toLowerCase()),
                    );
                    setFilteredData(x);
                  } else {
                    setFilteredData(
                      allData.filter(
                        entry => entry.student_addmission_year === year,
                      ),
                    );
                  }
                }}
              />
            </View>
            {filteredData.map((student, index) => (
              <View style={styles.dataView} key={index}>
                <Text selectable style={styles.bankDataText}>
                  SL:{index + 1}
                </Text>
                <Image
                  style={{
                    width: responsiveWidth(35),
                    height: responsiveWidth(40),
                    padding: responsiveWidth(2),
                    margin: responsiveWidth(2),
                    borderRadius: responsiveWidth(2),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    elevation: 5,
                  }}
                  source={{uri: student?.url}}
                />
                <Text selectable style={styles.bankDataText}>
                  Application No: {student?.id}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  STUDENT NAME: {student?.student_eng_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  FATHER&#8217;S NAME: {student?.father_eng_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  CLASS: {student?.student_addmission_class}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  VALIDATION:{'\n '}
                  {calculateAge(
                    getCurrentDateInput(student?.student_birthday),
                    student?.student_addmission_class,
                  )}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  ADMISSION DATE:{'\n '}
                  {DateValueToSring(student?.student_addmission_dateAndTime)}
                </Text>
                {student?.updatedAt && (
                  <Text selectable style={styles.bankDataText}>
                    Updated At:
                    {'\n '} {DateValueToSring(student?.updatedAt)}
                  </Text>
                )}
                <Text selectable style={styles.bankDataText}>
                  Action:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingHorizontal: responsiveWidth(2),
                    marginBottom: responsiveHeight(1),
                  }}>
                  <CustomButton
                    title={'View'}
                    color={'darkgreen'}
                    size={'small'}
                    onClick={() => {
                      setStateObject(student);
                      navigation.navigate('ViewForm');
                    }}
                  />

                  <CustomButton
                    title={'Download'}
                    fontSize={responsiveFontSize(1.3)}
                    color={'chocolate'}
                    size={'small'}
                    onClick={async () => {
                      const url = `${WEBSITE}/downloadAdmissionForm?id=${student?.id}&mobile=${student?.student_mobile}`;
                      await Linking.openURL(url);
                    }}
                  />
                  <CustomButton
                    title={'Delete'}
                    color={'darkred'}
                    size={'small'}
                    onClick={() => showConfirmDialog(student)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: 5,
    color: THEME_COLOR,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: THEME_COLOR,
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  result: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: 'darkgreen',
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: THEME_COLOR,
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  itemView: {
    width: responsiveWidth(92),
    backgroundColor: 'white',

    alignSelf: 'center',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(0.5),
    padding: responsiveWidth(2),
    shadowColor: 'black',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255,.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dropDownText: {
    fontSize: responsiveFontSize(1.8),
    color: 'royalblue',
    alignSelf: 'center',
    textAlign: 'center',
  },
  error: {
    fontSize: responsiveFontSize(1.8),
    color: 'red',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'kalpurush',
    marginVertical: responsiveHeight(1),
  },
  dropDownTextTransfer: {
    fontSize: responsiveFontSize(1.8),
    color: THEME_COLOR,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  dropDownnSelector: {
    width: responsiveWidth(76),
    height: responsiveHeight(7),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: THEME_COLOR,
    alignSelf: 'center',
    marginTop: responsiveHeight(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
  },
  dropDowArea: {
    width: responsiveWidth(76),

    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(1),
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
  },
  AdminName: {
    width: responsiveWidth(76),
    height: responsiveHeight(7),
    borderBottomWidth: 0.2,
    borderBottomColor: THEME_COLOR,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    marginTop: responsiveHeight(3),
    alignSelf: 'center',
    color: THEME_COLOR,
  },
  dataView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: responsiveHeight(0.5),
    borderRadius: responsiveWidth(3),
    padding: responsiveWidth(1),
    width: responsiveWidth(94),
    elevation: 5,
  },
  bankDataText: {
    alignSelf: 'center',
    color: THEME_COLOR,
    textAlign: 'center',
    padding: 1,
    fontSize: responsiveFontSize(2),
    marginLeft: 5,
  },
});
