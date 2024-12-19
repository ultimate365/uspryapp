import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Switch,
  BackHandler,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useGlobalContext} from '../context/Store';
import {
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOLNAME,
} from '../modules/constants';
import {showToast} from '../modules/Toaster';
import {
  compareObjects,
  getCurrentDateInput,
  getSubmitDateInput,
  IndianFormat,
  monthNamesWithIndex,
  round2dec,
  todayInString,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import AnimatedSeacrch from '../components/AnimatedSeacrch';

export default function StudentList() {
  const {
    state,
    studentState,
    studentUpdateTime,
    setStudentState,
    setStudentUpdateTime,
    setActiveTab,
  } = useGlobalContext();
  const navigation = useNavigation();
  const access = state?.ACCESS;
  const [showTable, setShowTable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [firstData, setFirstData] = useState(0);
  const [visibleItems, setVisibleItems] = useState(10);
  const [pageData, setPageData] = useState(10);
  const scrollRef = useRef();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  const loadPrev = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems - pageData);
    setFirstData(firstData - pageData);
    scrollToTop();
  };
  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + pageData);
    setFirstData(firstData + pageData);
    scrollToTop();
  };
  const getStudentData = async () => {
    setLoader(true);
    await firestore()
      .collection('students')
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(data);
        setFilteredData(data);
        setShowTable(true);
        setStudentState(data);
        setStudentUpdateTime(Date.now());
        setLoader(false);
      });
  };
  useEffect(() => {
    const studentDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (studentDifference >= 1 || studentState.length === 0) {
      getStudentData();
    } else {
      setData(studentState);
      setFilteredData(studentState);
      setShowTable(true);
    }
  }, []);
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
      <Loader visible={loader} />
      <ScrollView ref={scrollRef} style={{marginVertical: responsiveHeight(2)}}>
        <Text style={styles.title}>Students List</Text>
        <AnimatedSeacrch
          value={search}
          placeholder={'Search Student Name'}
          onChangeText={text => {
            const fdata = studentState.filter(item =>
              item.student_name.toLowerCase().includes(text.toLowerCase()),
            );
            setSearch(text);
            setFilteredData(fdata);
            setFirstData(0);
            setVisibleItems(fdata.length);
          }}
          onClick={() => {
            setSearch('');
            setFilteredData(studentState);
            setFirstData(0);
            setVisibleItems(10);
          }}
          func={() => {
            setSearch('');
            setFilteredData(studentState);
            setFirstData(0);
            setVisibleItems(10);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: responsiveHeight(1),
          }}>
          {firstData >= 10 && (
            <View>
              <CustomButton
                color={'orange'}
                title={'Previous'}
                onClick={loadPrev}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
          {visibleItems < filteredData.length && (
            <View>
              <CustomButton
                title={'Next'}
                onClick={loadMore}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
        </View>

        {filteredData.length > 0 && showTable ? (
          filteredData.slice(firstData, visibleItems).map((row, index) => {
            return (
              <View style={styles.dataView} key={index}>
                <Text selectable style={styles.bankDataText}>
                  Sl: {studentState.findIndex(i => i.id === row.id) + 1}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Student Name: {row.student_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Class: {row.class?.split(' (A)')[0]}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Roll No.: {row.roll_no}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Father's Name: {row.father_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Mother's Name: {row.mother_name}
                </Text>
                <Text selectable style={styles.bankDataText}>
                  Student ID: {row.student_id}
                </Text>
                {access === 'teacher' && (
                  <View>
                    {row.mobile === '0' ? null : row.mobile ===
                      '9999999999' ? null : row.mobile ===
                      '7872882343' ? null : row.mobile ===
                      '7679230482' ? null : (
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          flexDirection: 'column',
                          flexWrap: 'wrap',
                        }}
                        onPress={async () =>
                          await Linking.openURL(`tel:${parseInt(row.mobile)}`)
                        }>
                        <Text selectable style={styles.bankDataText}>
                         Mobile: {row.mobile}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <Text selectable style={styles.bankDataText}>
                      Student's Date of Birth: {row.birthdate}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <Text selectable style={styles.bankDataText}>
            No Entry found for the selected Year.
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: responsiveHeight(1),
          }}>
          {firstData >= 10 && (
            <View>
              <CustomButton
                color={'orange'}
                title={'Previous'}
                onClick={loadPrev}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
          {visibleItems < filteredData.length && (
            <View>
              <CustomButton
                title={'Next'}
                onClick={loadMore}
                size={'small'}
                fontSize={14}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '500',
    paddingLeft: responsiveWidth(4),
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
    backgroundColor: 'palegoldenrod',
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
    width: responsiveWidth(96),
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
