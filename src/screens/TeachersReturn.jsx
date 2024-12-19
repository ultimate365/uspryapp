import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
import {useGlobalContext} from '../context/Store';
import {
  BLOCK,
  BUILDING,
  CIRCLE,
  DRINKING_WATER,
  GIRLS_TOILET,
  HOI_MOBILE_NO,
  JLNO,
  KHATIAN_NO,
  LAST_DAY_OF_INSPECTION,
  MEDIUM,
  MOUZA,
  PLOT_NO,
  PO,
  PS,
  SCHNO,
  SCHOOL_AREA,
  SCHOOL_RECOGNITION_DATE,
  SCHOOLNAME,
  UDISE_CODE,
  VILL,
  WARD_NO,
  WEBSITE,
} from '../modules/constants';
import {showToast} from '../modules/Toaster';
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  sortMonthwise,
  todayInString,
  uniqArray,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
export default function TeachersReturn() {
  const {state, returnState, setReturnState, setActiveTab} = useGlobalContext();
  const access = state?.ACCESS;
  const user = state?.USER;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [addRemark, setAddRemark] = useState(false);
  const [showFrontPage, setShowFrontPage] = useState(true);
  const [showBackPage, setShowBackPage] = useState(true);
  const [workingDays, setWorkingDays] = useState(24);
  const [editTeacher, setEditTeacher] = useState({
    cast: '',
    tname: '',
    training: '',
    education: '',
    dor: '',
    desig: '',
    rank: '',
    dojnow: '',
    dob: '',
    id: '',
    doj: '',
    clThisMonth: '',
    clThisYear: '',
    olThisMonth: '',
    olThisYear: '',
    fullPay: '',
    halfPay: '',
    WOPay: '',
    workingDays: workingDays,
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [students, setStudents] = useState({});
  const [showAvrAtt, setShowAvrAtt] = useState(false);
  const [beforeSubmit, setBeforeSubmit] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const currentDate = new Date();
  const [inspectionDate, setInspectionDate] = useState(
    new Date(getCurrentDateInput(LAST_DAY_OF_INSPECTION)),
  );
  const [date, setDate] = useState(new Date());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);
  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setInspectionDate(currentSelectedDate);
    const year = currentSelectedDate?.getFullYear();
    let month = currentSelectedDate?.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = currentSelectedDate?.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    const tarikh = `${day}-${month}-${year}`;
    setDate(tarikh);
    console.log(tarikh);
    setFontColor('black');
    setInspection({
      ...inspection,
      inspectionDate: tarikh,
    });
  };
  const month =
    monthNamesWithIndex[
      currentDate?.getDate() > 10
        ? currentDate?.getMonth()
        : currentDate?.getMonth() - 1
    ].monthName;
  const year = currentDate?.getFullYear();
  const [yearArray, setYearArray] = useState([]);
  const [allEnry, setAllEnry] = useState([]);
  const [filteredEntry, setFilteredEntry] = useState([]);
  const [moreFilteredEntry, setMoreFilteredEntry] = useState([]);
  const [entryMonths, setEntryMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [returnYear, setReturnYear] = useState('');
  const [returnMonth, setReturnMonth] = useState('');
  const getMonth = () => {
    return `${month.toUpperCase()} of ${year}`;
  };
  const getID = () => {
    return `${month}-${year}`;
  };
  const [showModal, setShowModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspection, setInspection] = useState({
    inspectionDate: new Date(getCurrentDateInput(LAST_DAY_OF_INSPECTION)),
    pp: '',
    i: '',
    ii: '',
    iii: '',
    iv: '',
    v: '',
    total: '',
  });
  const id = getID();
  const entry = {
    id,
    month,
    year,
    teachers: filteredData,
    students,
    workingDays,
    inspection,
    date: todayInString(),
    remarks,
  };

  const [monthText, setMonthText] = useState('');

  const handleChange = value => {
    if (value !== '') {
      setMonthText('');
      const selectedValue = value;
      let x = [];
      let y = [];
      allEnry.map(entry => {
        const entryYear = entry?.year?.toString();
        const entryMonth = entry?.month;

        if (entryYear === selectedValue) {
          x.push(entry);
        }
        if (entryYear === selectedValue) {
          monthNamesWithIndex.map(month => {
            if (entryMonth === month.monthName) {
              y.push(month);
            }
          });
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredEntry(x);
      setMoreFilteredEntry(x);
      setEntryMonths(uniqArray(y));
    } else {
      setFilteredEntry([]);
      setSelectedYear('');
      setShowMonthSelection(false);
      showToast('error', 'Please select a year');
    }
  };
  const [selectedRemarks, setSelectedRemarks] = useState('');
  const [selectedWorkingDays, setSelectedWorkingDays] = useState('');
  const [selectedInspection, setSelectedInspection] = useState({
    inspectionDate: '',
    pp: '',
    i: '',
    ii: '',
    iii: '',
    iv: '',
    v: '',
    total: '',
  });
  const [selectedFilteredData, setSelectedFilteredData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedReturnMonth, setSelectedReturnMonth] = useState('');
  const [selectedReturnYear, setSelectedReturnYear] = useState('');
  const [selectedThisMonthReturnData, setSelectedThisMonthReturnData] =
    useState({});
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const handleMonthChange = month => {
    console.log(month);
    let x = [];

    allEnry.map((entry, index) => {
      const entryYear = entry.year.toString();
      const entryMonth = entry.month;
      if (entryYear === selectedYear && entryMonth === month.monthName) {
        x.push(entry);
        setSelectedRemarks(entry?.remarks);
        setSelectedWorkingDays(entry?.workingDays);
        setSelectedInspection(entry?.inspection);
        setSelectedFilteredData(entry?.teachers);
        setSelectedStudents(entry?.students);
        setSelectedReturnMonth(entry?.month);
        setSelectedReturnYear(entry?.year);
        setSelectedThisMonthReturnData(JSON.stringify(entry));
        setShowDownloadBtn(true);
        return x;
      }
    });
    setFilteredEntry(x);
    setMonthText(month.monthName);
  };

  const getMonthlyData = async () => {
    setLoader(true);
    await firestore()
      .collection('monthlyTeachersReturn')
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const monthwiseSorted = sortMonthwise(data);
        setReturnState(monthwiseSorted);
        setLoader(false);
        calledData(monthwiseSorted);
        appedData(monthwiseSorted[monthwiseSorted.length - 1]);
      });
  };
  const appedData = data => {
    setTeachers(data.teachers);
    setFilteredData(data.teachers);
    setStudents(data.students);
    setInspection(data.inspection);
    setWorkingDays(data.workingDays);
    setShowModal(true);
  };
  const calledData = array => {
    let x = [];
    array.map(entry => {
      const entryYear = entry.id.split('-')[1];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setYearArray(x);
    setAllEnry(array);
    setFilteredEntry(array);
    setLoader(false);
  };
  const getArrayLength = year => {
    let x = [];
    returnState.map(entry => {
      const entryYear = entry.id?.split('-')[1];
      if (entryYear === year) {
        x.push(entry);
      }
    });
    return x.length;
  };
  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      await setDoc(doc(firestore, 'monthlyTeachersReturn', id), entry);
      await firestore().collection('monthlyTeachersReturn').doc(id).set(entry);
      setReturnState([...returnState, entry]);
      showToast('success', 'Monthly Data Submitted Successfully!');
      setLoader(false);
      setShowFrontPage(true);
      setShowBackPage(true);
    } catch (error) {
      console.log(error);
      setLoader(false);
      showToast('error', 'Failed to Submit Monthly Data');
    }
  };
  const showConfirmDialog = entry => {
    return Alert.alert(
      'Hold On!',
      'Are you sure, you want to Submit this Data?',
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Cancel',
          onPress: () => showToast('success', 'Entry Not Submited'),
        }, // The "Yes" button
        {
          text: 'Yes',
          onPress: async () => {
            setBeforeSubmit(false);
            submitMonthlyData();
          },
        },
      ],
    );
  };
  useEffect(() => {
    if (returnState.length === 0) {
      getMonthlyData();
    } else {
      calledData(returnState);
      appedData(returnState[returnState.length - 1]);
    }
    if (access !== 'teacher') {
      navigation.navigate('Home');
      setActiveTab(0);
      showToast('error', 'Unathorized access');
    }
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
      <ScrollView style={{marginBottom: responsiveHeight(5)}}>
        {showModal && (
          <ScrollView>
            <Text style={styles.title}>Set Working Days</Text>
            <CustomTextInput
              title={'***Set Total Working Days of this Month'}
              placeholder="Enter Working Days"
              value={workingDays.toString()}
              onChangeText={e => {
                if (e !== '') {
                  setWorkingDays(parseInt(e));
                  try {
                    // Map over teachers and create the updated array
                    const myData = teachers.map(data => {
                      if (data.clThisMonth) {
                        // Update the workingDays field
                        return {
                          ...data,
                          workingDays: parseInt(e) - data.clThisMonth,
                        };
                      }
                      return data;
                    });
                    // Update the filtered data with the new array
                    setFilteredData(myData);
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setWorkingDays('');
                }
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(40),
              }}>
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => setShowModal(false)}
              />
            </View>
          </ScrollView>
        )}
        {!showAvrAtt &&
          !showEditForm &&
          !showDownload &&
          !beforeSubmit &&
          !showInspectionModal &&
          !showModal &&
          !addRemark &&
          !showEditForm && (
            <View>
              <Text style={styles.title}>Teachers Return</Text>
              <CustomButton
                title={'Set Working Days'}
                onClick={() => {
                  setShowModal(true);
                  setShowInspectionModal(false);
                  setShowAvrAtt(false);
                  setShowDownload(false);
                }}
              />
              <CustomButton
                title={'Submit Return Data'}
                color={'purple'}
                onClick={() => {
                  setBeforeSubmit(true);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowAvrAtt(false);
                  setShowDownload(false);
                }}
              />
              <CustomButton
                title={'Download Return Data'}
                color={'darkcyan'}
                onClick={() => {
                  setShowDownload(true);
                  setBeforeSubmit(false);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowAvrAtt(false);
                }}
              />
              <CustomButton
                title={'Edit Inspection Section'}
                color={'seagreen'}
                onClick={() => {
                  setShowInspectionModal(true);
                  setShowModal(false);
                  setShowAvrAtt(false);
                  setShowDownload(false);
                }}
              />
              <CustomButton
                title={'Edit Average Attaindance'}
                color={'chocolate'}
                onClick={() => {
                  setShowAvrAtt(true);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowDownload(false);
                }}
              />
              <CustomButton
                color={'blueviolet'}
                title={addRemark ? 'Close Remark' : 'Write Remark'}
                onClick={() => {
                  setAddRemark(!addRemark);
                  setShowAvrAtt(false);
                  setShowModal(false);
                  setShowInspectionModal(false);
                  setShowDownload(false);
                }}
              />
            </View>
          )}
        {showInspectionModal && (
          <ScrollView>
            <Text style={styles.title}>Set Inspection Days</Text>
            <View style={{marginVertical: responsiveHeight(1)}}>
              <Text style={styles.label}>Inspection Date*</Text>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  borderColor: 'skyblue',
                  borderWidth: 1,
                  width: responsiveWidth(76),
                  height: 50,
                  alignSelf: 'center',
                  borderRadius: responsiveWidth(3),
                  justifyContent: 'center',
                }}
                onPress={() => setOpen(true)}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    color: fontColor,
                    paddingLeft: 14,
                  }}>
                  {inspectionDate.getDate() < 10
                    ? '0' + inspectionDate.getDate()
                    : inspectionDate.getDate()}
                  -
                  {inspectionDate.getMonth() + 1 < 10
                    ? `0${inspectionDate.getMonth() + 1}`
                    : inspectionDate.getMonth() + 1}
                  -{inspectionDate.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={inspectionDate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
            </View>
            <CustomTextInput
              title={'PP Attaindance'}
              placeholder={'Enter PP Attaindance'}
              type={'number-pad'}
              value={inspection?.pp.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    pp: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    pp: '',
                    total:
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class I Attaindance'}
              placeholder={'Enter Class I Attaindance'}
              type={'number-pad'}
              value={inspection?.i.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    i: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    i: '',
                    total:
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class II Attaindance'}
              placeholder={'Enter Class II Attaindance'}
              type={'number-pad'}
              value={inspection?.ii.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    ii: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    ii: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.iii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class III Attaindance'}
              placeholder={'Enter Class III Attaindance'}
              type={'number-pad'}
              value={inspection?.iii.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    iii: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    iii: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class IV Attaindance'}
              placeholder={'Enter Class IV Attaindance'}
              type={'number-pad'}
              value={inspection?.iv.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    iii: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    iii: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iv +
                      inspection?.v,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Class V Attaindance'}
              placeholder={'Enter Class V Attaindance'}
              type={'number-pad'}
              value={inspection?.v.toString()}
              onChangeText={e => {
                if (e) {
                  setInspection({
                    ...inspection,
                    v: parseInt(e),
                    total:
                      parseInt(e) +
                      inspection?.pp +
                      inspection?.i +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv,
                  });
                } else {
                  setInspection({
                    ...inspection,
                    v: '',
                    total:
                      inspection?.i +
                      inspection?.pp +
                      inspection?.ii +
                      inspection?.iii +
                      inspection?.iv,
                  });
                }
              }}
            />
            <CustomTextInput
              title={'Total Attaindance Attaindance'}
              placeholder={'Enter Total Attaindance Attaindance'}
              type={'number-pad'}
              value={inspection?.total.toString()}
              editable={false}
              onChangeText={e => {
                showToast('error', 'Cannot Change Total Attaindance');
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(40),
              }}>
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => setShowInspectionModal(false)}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setShowInspectionModal(false)}
              />
            </View>
          </ScrollView>
        )}
        {beforeSubmit && (
          <ScrollView>
            <Text style={styles.title}>
              ***Showing Data you are Going to Submit
            </Text>
            <Text style={styles.label}>ID:{entry?.id}</Text>
            <Text style={styles.label}>Year:{entry?.year}</Text>
            <Text style={styles.label}>Month:{entry?.month}</Text>
            <Text style={styles.label}>
              InspectionDate:{entry?.inspectionDate}
            </Text>
            <Text style={styles.label}>WorkingDays:{entry?.workingDays}</Text>
            <Text style={styles.label}>Date:{entry?.date}</Text>
            <Text style={styles.label}>Remarks:{entry?.remarks}</Text>
            <View
              style={{
                flexWrap: 'wrap',
                paddingHorizontal: responsiveWidth(2),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text style={styles.label}>Teachers:</Text>
              {entry?.teachers.map((teacher, index) => (
                <View key={index}>
                  <Text style={styles.bankDataText}>Name:{teacher?.tname}</Text>
                  <Text style={styles.bankDataText}>
                    Data:
                    {JSON.stringify(teacher)
                      .split(`"`)
                      .join('')
                      .split('{')
                      .join('')
                      .split('}')
                      .join('')}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                flexWrap: 'wrap',
                paddingHorizontal: responsiveWidth(2),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text style={styles.label}>Students:</Text>
              <Text style={styles.label}>PP:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.pp)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class I:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.i)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class II:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.ii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class III:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.iii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.label}>Class IV:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.iv)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              {entry?.students?.v?.Total !== '-' && (
                <View>
                  <Text style={styles.label}>Class V:</Text>
                  <Text style={styles.bankDataText}>
                    {JSON.stringify(entry?.students?.iv)
                      .split(`"`)
                      .join('')
                      .split('{')
                      .join('')
                      .split('}')
                      .join('')}
                  </Text>
                </View>
              )}
              <Text style={styles.label}>Total:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(entry?.students?.total)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
            </View>
            <View
              style={{
                flexWrap: 'wrap',
                paddingHorizontal: responsiveWidth(2),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text style={styles.label}>Inspection:</Text>
              <Text style={styles.bankDataText}>Date:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.inspectionDate)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>PP:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.pp)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class I:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.i)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class II:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.ii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class III:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.iii)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              <Text style={styles.bankDataText}>Class IV:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.iv)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
              {inspection?.v?.Total !== '-' && (
                <View>
                  <Text style={styles.bankDataText}>Class V:</Text>
                  <Text style={styles.bankDataText}>
                    {JSON.stringify(inspection?.v)
                      .split(`"`)
                      .join('')
                      .split('{')
                      .join('')
                      .split('}')
                      .join('')}
                  </Text>
                </View>
              )}
              <Text style={styles.bankDataText}>Total Student:</Text>
              <Text style={styles.bankDataText}>
                {JSON.stringify(inspection?.total)
                  .split(`"`)
                  .join('')
                  .split('{')
                  .join('')
                  .split('}')
                  .join('')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(40),
              }}>
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => showConfirmDialog()}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setBeforeSubmit(false)}
              />
            </View>
          </ScrollView>
        )}

        {addRemark && (
          <ScrollView>
            <Text style={styles.title}>Set Remarks</Text>
            <CustomTextInput
              title={'***Set Remarks for this Month'}
              size={'large'}
              placeholder="Enter Remarks"
              value={remarks}
              onChangeText={e => setRemarks(e)}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(60),
              }}>
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => {
                  setAddRemark(false);
                }}
              />
              {remarks.length > 0 && (
                <CustomButton
                  title={'Clear'}
                  color={'darkorange'}
                  size={'xsmall'}
                  onClick={() => {
                    setRemarks('');
                  }}
                />
              )}
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setAddRemark(false)}
              />
            </View>
          </ScrollView>
        )}
        {showAvrAtt && (
          <ScrollView>
            <Text style={styles.title}>Set Average Attaindance</Text>
            <CustomTextInput
              title={'PP'}
              type={'number-pad'}
              placeholder="Enter PP Attaindance"
              value={(students?.pp?.averageAttendance !== undefined &&
              students?.pp?.averageAttendance !== null
                ? students?.pp?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  pp: {
                    ...students?.pp,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      parseInt(value) +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class I'}
              type={'number-pad'}
              placeholder="Enter Class I Attaindance"
              value={(students?.i?.averageAttendance !== undefined &&
              students?.i?.averageAttendance !== null
                ? students?.i?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  i: {
                    ...students?.i,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      parseInt(value) +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class II'}
              type={'number-pad'}
              placeholder="Enter Class II Attaindance"
              value={(students?.ii?.averageAttendance !== undefined &&
              students?.ii?.averageAttendance !== null
                ? students?.ii?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  ii: {
                    ...students?.ii,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      parseInt(value) +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class III'}
              type={'number-pad'}
              placeholder="Enter Class III Attaindance"
              value={(students?.iii?.averageAttendance !== undefined &&
              students?.iii?.averageAttendance !== null
                ? students?.iii?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  iii: {
                    ...students?.iii,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      parseInt(value) +
                      students?.iv?.averageAttendance +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class IV'}
              type={'number-pad'}
              placeholder="Enter Class IV Attaindance"
              value={(students?.iv?.averageAttendance !== undefined &&
              students?.iv?.averageAttendance !== null
                ? students?.iv?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  iv: {
                    ...students?.iv,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      parseInt(value) +
                      students?.v?.averageAttendance,
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Class V'}
              type={'number-pad'}
              placeholder="Enter Class V Attaindance"
              value={(students?.v?.averageAttendance !== undefined &&
              students?.v?.averageAttendance !== null
                ? students?.v?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  v: {
                    ...students?.v,
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                  total: {
                    ...students?.total,
                    averageAttendance:
                      students?.pp?.averageAttendance +
                      students?.i?.averageAttendance +
                      students?.ii?.averageAttendance +
                      students?.iii?.averageAttendance +
                      students?.iv?.averageAttendance +
                      parseInt(value),
                  },
                });
              }}
            />
            <CustomTextInput
              title={'Total'}
              type={'number-pad'}
              placeholder="Enter Total Attaindance"
              value={(students?.total?.averageAttendance !== undefined &&
              students?.total?.averageAttendance !== null
                ? students?.total?.averageAttendance
                : ''
              ).toString()}
              onChangeText={e => {
                const value = e;
                setStudents({
                  ...students,
                  total: {
                    ...students?.total, // Corrected this to use `students?.total`
                    averageAttendance:
                      value === '' ? null : parseInt(value, 10),
                  },
                });
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(40),
              }}>
              <CustomButton
                title={'Save'}
                color={'green'}
                size={'xsmall'}
                onClick={() => {
                  setShowAvrAtt(false);
                }}
              />
              <CustomButton
                title={'Close'}
                color={'red'}
                size={'xsmall'}
                onClick={() => setShowAvrAtt(false)}
              />
            </View>
          </ScrollView>
        )}
        {!showAvrAtt &&
          !showEditForm &&
          !beforeSubmit &&
          !showDownload &&
          !showInspectionModal &&
          !showModal &&
          !addRemark &&
          !showEditForm && (
            <ScrollView>
              <Text style={styles.title}>Edit Teacher Data</Text>
              {teachers.map((teacher, index) => (
                <View style={styles.dataView} key={index}>
                  <Text style={styles.label}>
                    SL.: {index + 1}) {teacher.tname}
                  </Text>
                  <CustomButton
                    title={'Edit'}
                    size={'xsmall'}
                    color={'orange'}
                    onClick={() => {
                      setEditTeacher(teacher);
                      setShowEditForm(true);
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          )}

        {showEditForm && (
          <ScrollView>
            <Text style={styles.title}>Edit Teacher Data</Text>
            <Text style={styles.error}>
              *** Please Set This Month&#8217;s Working Days First
            </Text>
            <Text style={styles.error}>
              *** Total Working Days of This Month is {workingDays}
            </Text>
            <View style={{marginVertical: responsiveHeight(2)}}>
              <CustomTextInput
                title={'CL This Month'}
                placeholder={'CL This Month'}
                value={editTeacher?.clThisMonth?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      clThisMonth: parseInt(e),
                      workingDays:
                        workingDays -
                        parseInt(e) -
                        (editTeacher.olThisMonth ? editTeacher.olThisMonth : 0),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      clThisMonth: '',
                      workingDays:
                        workingDays -
                        (editTeacher.olThisMonth ? editTeacher.olThisMonth : 0),
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'CL This Year'}
                placeholder={'CL This Year'}
                value={editTeacher?.clThisYear?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      clThisYear: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      clThisYear: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Other Leave This Month'}
                placeholder={'Other Leave This Month'}
                value={editTeacher?.olThisMonth?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    const leave =
                      workingDays -
                      parseInt(e) -
                      (editTeacher.clThisMonth ? editTeacher.clThisMonth : 0);
                    if (leave >= 0) {
                      setEditTeacher({
                        ...editTeacher,
                        olThisMonth: parseInt(e),
                        workingDays: leave,
                      });
                    } else {
                      setEditTeacher({
                        ...editTeacher,
                        olThisMonth: parseInt(e),
                        workingDays: 0,
                      });
                    }
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      olThisMonth: '',
                      workingDays:
                        workingDays -
                        (editTeacher.clThisMonth ? editTeacher.clThisMonth : 0),
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Other Leave This Year'}
                placeholder={'Other Leave This Year'}
                value={editTeacher?.olThisYear?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      olThisYear: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      olThisYear: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Full Pay'}
                placeholder={'Full Pay'}
                value={editTeacher?.fullPay?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      fullPay: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      fullPay: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Half Pay'}
                placeholder={'Half Pay'}
                value={editTeacher?.halfPay?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      halfPay: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      halfPay: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Without Pay'}
                placeholder={'Without Pay'}
                value={editTeacher?.WOPay?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      WOPay: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      WOPay: '',
                    });
                  }
                }}
              />
              <CustomTextInput
                title={'Working Days'}
                placeholder={'Working Days'}
                value={editTeacher?.workingDays?.toString()}
                onChangeText={e => {
                  if (e !== '') {
                    setEditTeacher({
                      ...editTeacher,
                      workingDays: parseInt(e),
                    });
                  } else {
                    setEditTeacher({
                      ...editTeacher,
                      workingDays: '',
                    });
                  }
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: responsiveWidth(40),
                }}>
                <CustomButton
                  title={'Save'}
                  color={'green'}
                  size={'xsmall'}
                  onClick={() => {
                    const updatedArray = filteredData
                      .map(t => (t.id === editTeacher?.id ? editTeacher : t))
                      .sort((a, b) => a.rank - b.rank);
                    setFilteredData(updatedArray);
                    setEditTeacher({
                      cast: '',
                      tname: '',
                      training: '',
                      education: '',
                      dor: '',
                      desig: '',
                      rank: '',
                      dojnow: '',
                      dob: '',
                      id: '',
                      doj: '',
                      clThisMonth: '',
                      clThisYear: '',
                      olThisMonth: '',
                      olThisYear: '',
                      fullPay: '',
                      halfPay: '',
                      WOPay: '',
                      workingDays: workingDays,
                    });
                    setShowEditForm(false);
                  }}
                />
                <CustomButton
                  title={'Close'}
                  color={'red'}
                  size={'xsmall'}
                  onClick={() => {
                    setShowEditForm(false);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        )}
        {showDownload && (
          <ScrollView>
            <Text style={styles.title}>Download Report</Text>
            <View style={{marginVertical: responsiveHeight(2)}}>
              {yearArray.length > 0 && (
                <View style={styles.dataView}>
                  <Text selectable style={styles.bankDataText}>
                    Please Select Any Year
                  </Text>
                </View>
              )}
              <View
                style={{
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginHorizontal: responsiveWidth(1),
                  marginVertical: responsiveHeight(1),
                  flexWrap: 'wrap',
                  width: responsiveWidth(95),
                }}>
                {yearArray.length > 0 &&
                  yearArray.map((year, index) => (
                    <View
                      key={index}
                      style={{
                        marginHorizontal: responsiveWidth(1),
                        marginVertical: responsiveHeight(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: responsiveWidth(3),
                        padding: responsiveWidth(0.5),
                      }}>
                      <CustomButton
                        title={year}
                        size={'xsmall'}
                        color={selectedYear === year ? 'green' : null}
                        fontColor={selectedYear === year ? 'seashell' : null}
                        onClick={() => handleChange(year)}
                      />
                      <View
                        key={index}
                        style={{
                          marginHorizontal: responsiveWidth(0.5),
                          marginVertical: responsiveHeight(0.5),
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          borderRadius: responsiveWidth(3),
                          backgroundColor: 'lightgoldenrodyellow',
                          padding: responsiveWidth(0.5),
                        }}>
                        <Text
                          style={{
                            color: 'magenta',
                            fontSize: responsiveFontSize(1.3),
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}>
                          {new Date().getFullYear() - parseInt(year) > 1
                            ? new Date().getFullYear() -
                              parseInt(year) +
                              ' Years'
                            : new Date().getFullYear() - parseInt(year) === 1
                            ? new Date().getFullYear() -
                              parseInt(year) +
                              ' Year'
                            : 'This Year'}
                        </Text>
                        <Text
                          style={{
                            color: 'blue',
                            fontSize: responsiveFontSize(1.3),
                            alignSelf: 'center',
                            textAlign: 'center',
                            marginTop: responsiveHeight(0.1),
                          }}>
                          {getArrayLength(year) +
                            `${
                              getArrayLength(year) > 1 ? ' Entries' : ' Entry'
                            }`}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
              {selectedYear && showMonthSelection ? (
                <View>
                  {entryMonths.length > 1 && (
                    <Text selectable style={styles.bankDataText}>
                      Filter By Month
                    </Text>
                  )}
                </View>
              ) : null}
              {showMonthSelection && (
                <View
                  style={{
                    marginHorizontal: responsiveWidth(1),
                    marginVertical: responsiveHeight(1),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: responsiveWidth(3),
                    backgroundColor: 'lightgoldenrodyellow',
                    padding: responsiveWidth(0.5),
                  }}>
                  {entryMonths.length > 1 && (
                    <View
                      style={{
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        margin: responsiveWidth(1),
                        flexWrap: 'wrap',
                        width: responsiveWidth(95),
                      }}>
                      {entryMonths.map((month, index) => (
                        <View
                          key={index}
                          style={{
                            marginHorizontal: responsiveWidth(0.5),
                            marginVertical: responsiveHeight(0.5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: responsiveWidth(3),
                            backgroundColor: 'lightgoldenrodyellow',
                            padding: responsiveWidth(0.5),
                            flexDirection: 'column',
                          }}>
                          <CustomButton
                            title={month.monthName}
                            size={'xsmall'}
                            color={
                              month.monthName === monthText
                                ? 'mediumspringgreen'
                                : null
                            }
                            fontColor={
                              month.monthName === monthText ? 'indigo' : null
                            }
                            fontSize={responsiveFontSize(1.3)}
                            onClick={() => handleMonthChange(month)}
                          />
                          <Text
                            style={{
                              color: 'magenta',
                              fontSize: responsiveFontSize(1.3),
                              alignSelf: 'center',
                              textAlign: 'center',
                            }}>
                            {moreFilteredEntry.filter(
                              m => m.month === month.monthName,
                            ).length +
                              ` ${
                                moreFilteredEntry.filter(
                                  m => m.month === month.monthName,
                                ).length > 1
                                  ? ' Entries'
                                  : ' Entry'
                              }`}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {showDownloadBtn && (
                    <View>
                      <CustomButton
                        title={`Download ${selectedReturnMonth} ${selectedReturnYear} PDF`}
                        onClick={async () => {
                          await Linking.openURL(
                            `${WEBSITE}/downloadTeachersReturn?data=${selectedThisMonthReturnData}`,
                          );
                          setShowDownloadBtn(false);
                          setShowMonthSelection(false);
                          setShowDownload(false);
                        }}
                      />

                      <CustomButton
                        title={'Close'}
                        color={'red'}
                        size={'xsmall'}
                        onClick={() => setShowDownload(false)}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </ScrollView>
      {<Loader visible={loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
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
