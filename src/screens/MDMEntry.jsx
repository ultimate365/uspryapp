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
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOLNAME,
  WEBSITE,
  PREV_MDM_COST,
} from '../modules/constants';
import {showToast} from '../modules/Toaster';
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  todayInString,
  uniqArray,
  sortMonthwise,
  IndianFormat,
  months,
} from '../modules/calculatefunctions';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
export default function MDMEntry() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    state,
    mealState,
    setMealState,
    riceState,
    setRiceState,
    monthlyReportState,
    setMonthlyReportState,
    setActiveTab,
    transactionState,
    setTransactionState,
  } = useGlobalContext();
  const access = state?.ACCESS;
  const user = state?.USER;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [fontColor, setFontColor] = useState(THEME_COLOR);
  const [open, setOpen] = useState(false);

  const [pp, setPp] = useState('');
  const [pry, setPry] = useState('');
  const [showEntry, setShowEntry] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [mdmDone, setMdmDone] = useState(false);
  const [riceDone, setRiceDone] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showRiceData, setShowRiceData] = useState(false);
  const [errPP, setErrPP] = useState('');
  const [errPry, setErrPry] = useState('');
  const [docId, setDocId] = useState(todayInString());
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [moreFilteredData, setMoreFilteredData] = useState([]);
  const [monthlyReportData, setMonthlyReportData] = useState([]);
  const [thisMonthMDMAllowance, setThisMonthMDMAllowance] =
    useState(PREV_MDM_COST);
  const [ppTotalMeal, setPpTotalMeal] = useState('');
  const [pryTotalMeal, setPryTotalMeal] = useState('');
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [monthText, setMonthText] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [entryMonths, setEntryMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);
  const [riceData, setRiceData] = useState([]);
  const [filteredRiceData, setFilteredRiceData] = useState([]);
  const [riceOB, setRiceOB] = useState('');
  const [riceCB, setRiceCB] = useState('');
  const [ricePPOB, setRicePPOB] = useState('');
  const [ricePPRC, setRicePPRC] = useState('');
  const [ricePPEX, setRicePPEX] = useState('');
  const [ricePPCB, setRicePPCB] = useState('');
  const [ricePryOB, setRicePryOB] = useState('');
  const [ricePryRC, setRicePryRC] = useState('');
  const [ricePryEX, setRicePryEX] = useState('');
  const [ricePryCB, setRicePryCB] = useState('');
  const [riceGiven, setRiceGiven] = useState('');
  const [totalRiceGiven, setTotalRiceGiven] = useState('');
  const [riceExpend, setRiceExpend] = useState('');
  const [errRice, setErrRice] = useState('');
  const [showRiceBalance, setShowRiceBalance] = useState(false);
  const [showSubmitMonthlyReport, setShowSubmitMonthlyReport] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [monthToSubmit, setMonthToSubmit] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const [monthWorkingDays, setMonthWorkingDays] = useState('');
  const [totalWorkingDays, setTotalWorkingDays] = useState('');
  const [monthPPTotal, setMonthPPTotal] = useState('');
  const [monthlyPPCost, setMonthlyPPCost] = useState('');
  const [monthPRYTotal, setMonthPRYTotal] = useState('');
  const [monthlyPRYCost, setMonthlyPRYCost] = useState('');
  const [monthTotalCost, setMonthTotalCost] = useState('');
  const [thisMonthTotalCost, setThisMonthTotalCost] = useState('');
  const [monthRiceOB, setMonthRiceOB] = useState('');
  const [monthRiceGiven, setMonthRiceGiven] = useState('');
  const [monthRiceConsunption, setMonthRiceConsunption] = useState('');
  const [thisMonthTotalRiceConsumption, setThisMonthTotalRiceConsumption] =
    useState('');
  const [monthRiceCB, setMonthRiceCB] = useState('');
  const [monthYearID, setMonthYearID] = useState('');

  const [thisMonthlyData, setThisMonthlyData] = useState({
    id: '',
    month: '',
    year: '',
    financialYear: '',
    worrkingDays: '',
    totalWorkingDays: '',
    ppTotal: '',
    pryTotal: '',
    monthlyPPCost: '',
    monthlyPRYCost: '',
    totalCost: '',
    ricePPOB: '',
    ricePryOB: '',
    riceOB: '',
    ricePPRC: '',
    ricePryRC: '',
    ricePPEX: '',
    ricePryEX: '',
    ricePPCB: '',
    ricePryCB: '',
    riceCB: '',
    riceConsunption: '',
    riceGiven: '',
    date: '',
    remarks: '',
  });
  const [prevMonthlyData, setPrevMonthData] = useState({
    id: '',
    month: '',
    year: '',
    financialYear: '',
    worrkingDays: '',
    totalWorkingDays: '',
    ppTotal: '',
    pryTotal: '',
    monthlyPPCost: '',
    monthlyPRYCost: '',
    totalCost: '',
    ricePPOB: '',
    ricePryOB: '',
    riceOB: '',
    ricePPRC: '',
    ricePryRC: '',
    ricePPEX: '',
    ricePryEX: '',
    ricePPCB: '',
    ricePryCB: '',
    riceCB: '',
    riceConsunption: '',
    riceGiven: '',
    date: '',
    remarks: '',
  });
  const [thisMonthFromTransaction, setThisMonthFromTransaction] = useState({
    accountName: '',
    accountNumber: '',
    amount: '',
    purpose: '',
    type: '',
    date: '',
    id: '',
    ppOB: '',
    ppRC: '',
    ppCB: '',
    pryOB: '',
    pryRC: '',
    pryCB: '',
    openingBalance: '',
    closingBalance: '',
  });
  const [thisMonthFromFirstTransaction, setThisMonthFromFirstTransaction] =
    useState({
      accountName: '',
      accountNumber: '',
      amount: '',
      purpose: '',
      type: '',
      date: '',
      id: '',
      ppOB: '',
      ppRC: '',
      ppCB: '',
      pryOB: '',
      pryRC: '',
      pryCB: '',
      openingBalance: '',
      closingBalance: '',
    });

  const [balRCPrevMonth, setBalRCPrevMonth] = useState(0);
  const [balRCThisMonth, setBalRCThisMonth] = useState(0);
  const [pryRCThisMonth, setPryRCThisMonth] = useState(0);
  const [pryRCPrevMonth, setPryRCPrevMonth] = useState(0);
  const [ftFound, setFtFound] = useState(false);
  const [selectedYearTransactions, setSelectedYearTransactions] = useState([]);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const calculateAgeOnSameDay = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
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
  };
  const calculateAgeOnSameDay2 = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
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
    setDocId(tarikh);
    const filteredData = allEnry.filter(entry => entry.date === tarikh);
    if (filteredData.length > 0) {
      const selectedDateData = filteredData[0];
      setPp(selectedDateData.pp);
      setPry(selectedDateData.pry);
    } else {
      setPp('');
      setPry('');
      showToast('error', 'No Data Found on selected Date!');
    }
  };
  const calculateAgeOnSameDay3 = (event, selectedDate) => {
    const currentSelectedDate = selectedDate || date;
    setOpen('');
    setCurrentDate(currentSelectedDate);
    const year = currentSelectedDate?.getFullYear();
    let month = currentSelectedDate?.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = currentSelectedDate?.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    const data = `${day}-${month}-${year}`;
    setDate(data);
    console.log(data);
    setFontColor('black');
    const Year = data.split('-')[2];
    const Month = data.split('-')[1];
    const Day = parseInt(data.split('-')[0]);
    let prevDay = Day - 1;
    if (prevDay < 10) {
      prevDay = '0' + prevDay;
    }
    const prevDate = `${prevDay}-${Month}-${Year}`;
    let beforePrevDay = Day - 2;
    if (beforePrevDay < 10) {
      beforePrevDay = '0' + beforePrevDay;
    }
    const beforePrevDate = `${beforePrevDay}-${Month}-${Year}`;
    const filteredData = riceData.filter(entry => entry.date === prevDate);
    const filteredPrevDayData = riceData.filter(
      entry => entry.date === beforePrevDate,
    );
    if (filteredData.length > 0) {
      setRiceOB(filteredData[0]?.riceCB);
      setRiceCB(filteredData[0]?.riceCB);
    } else if (filteredPrevDayData.length > 0) {
      setRiceOB(filteredPrevDayData[0]?.riceCB);
      setRiceCB(filteredPrevDayData[0]?.riceCB);
    } else {
      showToast('error', `Could not find entry`);
    }
  };
  const submitData = async () => {
    if (validForm()) {
      setLoader(true);
      await firestore()
        .collection('mdmData')
        .doc(date)
        .set({
          pp: parseInt(pp),
          pry: parseInt(pry),
          date: date,
          id: date,
        })
        .then(() => {
          showToast('success', 'Data submitted successfully');
          // getMainData();
          let x = allEnry;
          x = [
            ...x,
            {pp: parseInt(pp), pry: parseInt(pry), date: date, id: date},
          ].sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date)),
          );
          setAllEnry(x);
          setMealState(x);
          setMdmDone(true);
          setPp('');
          setPry('');
          setDate(todayInString());
          setShowEntry(false);
          setLoader(false);
        })
        .catch(e => {
          showToast('error', 'Failed to submit data. Please try again');
          console.error(e);
          setLoader(false);
        });
    } else {
      showToast('error', 'Please fill all the required fields');
    }
  };
  const validForm = () => {
    let isValid = true;
    if (pp.length === 0) {
      setErrPP('PP Number is required');
      isValid = false;
    } else {
      setErrPP('');
      isValid = true;
    }
    if (pry.length === 0) {
      setErrPry('PRY Number is required');
      isValid = false;
    } else {
      setErrPry('');
      isValid = true;
    }

    return isValid;
  };

  const searchTodaysData = async () => {
    const todaysData = allEnry.filter(entry => entry.date === todayInString());
    if (todaysData.length > 0) {
      const data = todaysData[0];
      setPp(data.pp);
      setPry(data.pry);
      setDate(getCurrentDateInput(data.date));
      setDocId(data.date);
      setShowUpdate(true);
    } else {
      setDocId(todayInString());
      showToast('error', 'Todays Enry Not Done Yet!');
      setShowUpdate(true);
    }
    setShowDataTable(false);
    setShowMonthSelection(false);
    setShowEntry(false);
    setShowMonthlyReport(false);
    setShowRiceData(false);
  };

  const updateData = async () => {
    if (validForm()) {
      setLoader(true);
      try {
        await firestore()
          .collection('mdmData')
          .doc(docId)
          .set({
            pp: parseInt(pp),
            pp: parseInt(pp),
            pry: parseInt(pry),
            date: docId,
          })
          .then(() => {
            showToast('success', 'Data updated successfully');
            let x = [];
            x = allEnry.filter(entry => entry.id !== docId);
            x = [
              ...x,
              {pp: parseInt(pp), pry: parseInt(pry), date: docId, id: docId},
            ].sort(
              (a, b) =>
                Date.parse(getCurrentDateInput(a.date)) -
                Date.parse(getCurrentDateInput(b.date)),
            );
            setAllEnry(x);
            setMealState(x);
            setPp('');
            setPry('');
            setDate(todayInString());
            setDocId(todayInString());
            setShowEntry(false);
            setLoader(false);
          })
          .catch(e => {
            console.log(e);
            setLoader(false);
            showToast('error', 'Something went Wrong!');
          });
      } catch (error) {
        console.log(error);
        setLoader(false);
        showToast('error', 'Something went Wrong!');
      }
    } else {
      showToast('error', 'Please Fillup Required Details!');
    }
  };
  const getMainData = async () => {
    setLoader(true);
    await firestore()
      .collection('mdmData')
      .get()
      .then(snapshot => {
        const data = snapshot.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
          .sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date)),
          );
        setLoader(false);
        setAllEnry(data);
        setMealState(data);
        findMDMEntry(data);
      });
  };
  const findMDMEntry = array => {
    if (array.filter(el => el?.id === todayInString()).length > 0) {
      setMdmDone(true);
    } else {
      setMdmDone(false);
    }
  };

  const getRiceData = async () => {
    setLoader(true);
    await firestore()
      .collection('rice')
      .get()
      .then(snapshot => {
        const data = snapshot.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
          .sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date)),
          );
        setLoader(false);
        setRiceData(data);
        setRiceState(data);
        setRiceOB(data[data.length - 1].riceCB);
        setRiceCB(data[data.length - 1].riceCB);
        findRiceEntry(data);
      });
  };
  const findRiceEntry = array => {
    if (array.filter(el => el?.id === todayInString()).length > 0) {
      setRiceDone(true);
      setRiceOB(array[array.length - 1].riceOB);
      setRiceCB(array[array.length - 1].riceCB);
      setRiceExpend(array[array.length - 1].riceExpend);
      setRiceGiven(array[array.length - 1].riceGiven);
    } else {
      setRiceDone(false);
    }
  };
  const getMonthlyData = async () => {
    setLoader(true);
    await firestore()
      .collection('mothlyMDMData')
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const monthwiseSorted = sortMonthwise(data);
        setMonthlyReportState(monthwiseSorted);
        const thisMonthlyData = monthwiseSorted.filter(
          data => data.id === monthYearID,
        );
        if (thisMonthlyData.length > 0) {
          filterMonthlyData(thisMonthlyData[0]);
        }
        setLoader(false);
      });
  };
  const [allTransactions, setAllTransactions] = useState([]);
  const getTransactions = async () => {
    setLoader(true);
    if (transactionState.length > 0) {
      setAllTransactions(transactionState);
    } else {
      await firestore()
        .collection('transactions')
        .get()
        .then(snapshot => {
          const data = snapshot.docs
            .map(doc => ({
              ...doc.data(),
              id: doc.id,
            }))
            .sort(
              (a, b) =>
                Date.parse(getCurrentDateInput(a.date)) -
                Date.parse(getCurrentDateInput(b.date)),
            );
          setAllTransactions(data);
          setTransactionState(data);
        });
    }
  };

  const filterMonthlyData = entry => {
    setMonthWorkingDays(entry.worrkingDays);
    setTotalWorkingDays(entry.totalWorkingDays);
    setMonthPPTotal(entry.ppTotal);
    setMonthPRYTotal(entry.pryTotal);
    setMonthlyPPCost(entry.monthlyPPCost);
    setMonthlyPRYCost(entry.monthlyPRYCost);
    setMonthTotalCost(entry.totalCost);
    setRicePPOB(entry.ricePPOB);
    setRicePryOB(entry.ricePryOB);
    setMonthRiceOB(entry.riceOB);
    setRicePPRC(entry.ricePPRC);
    setRicePryRC(entry.ricePryRC);
    setMonthRiceGiven(entry.riceGiven);
    setRicePPEX(entry.ricePPEX);
    setRicePryEX(entry.ricePryEX);
    setMonthRiceConsunption(entry.riceConsunption);
    setRicePPCB(entry.ricePPCB);
    setRicePryCB(entry.ricePryCB);
    setMonthRiceCB(entry.riceCB);
    setRemarks(entry.remarks);
  };

  const calledData = array => {
    let x = [];
    array.map(entry => {
      const entryYear = entry.date.split('-')[2];
      x.push(entryYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setServiceArray(x);
    let ppTotal = 0;
    let pryTotal = 0;
    array.map(entry => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);

    setLoader(false);
    setAllEnry(array);
    setFilteredData(array);
    setShowEntry(false);
    setShowUpdate(false);
    setShowRiceData(false);
    setShowMonthlyReport(true);
  };
  const handleChange = value => {
    if (value !== '') {
      setMonthText('');
      const selectedValue = value;
      let x = [];
      let y = [];
      setSelectedYearTransactions(
        transactionState.filter(transaction => transaction.year === value),
      );
      allEnry.map(entry => {
        const entryYear = entry.date.split('-')[2];
        const entryMonth = entry.date.split('-')[1];
        if (entryYear === selectedValue) {
          x.push(entry);
        }
        if (entryYear === selectedValue) {
          monthNamesWithIndex.map(month => {
            if (entryMonth === month.index) {
              y.push(month);
            }
          });
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredData(x);
      setMoreFilteredData(x);
      setEntryMonths(uniqArray(y));
    } else {
      setFilteredData([]);
      setSelectedYear('');
    }
  };
  const handleMonthChange = month => {
    let x = [];
    let y = [];
    allEnry.map((entry, index) => {
      const entryYear = entry.date.split('-')[2];
      const entryMonth = entry.date.split('-')[1];
      if (entryYear === selectedYear && entryMonth === month.index) {
        return x.push(entry);
      }
    });
    riceData.map(entry => {
      const entryYear = entry.date.split('-')[2];
      const entryMonth = entry.date.split('-')[1];
      if (entryYear === selectedYear && entryMonth === month.index) {
        return y.push(entry);
      }
    });

    if (month.rank < 4) {
      setFinancialYear(`${parseInt(selectedYear) - 1}-${selectedYear}`);
    } else {
      setFinancialYear(`${selectedYear}-${parseInt(selectedYear) + 1}`);
    }
    const findEntry = monthlyReportState.filter(
      entry => entry.month === month.monthName,
    );
    if (findEntry.length > 0) {
      setShowDownloadButton(true);
      console.log('found entry');
    } else {
      setShowDownloadButton(false);
      console.log('entry not found');
    }
    monthlyReportState.map((entry, index) => {
      const entryMonth = entry.month;
      setThisMonthlyData(entry);
      setPrevMonthData(monthlyReportState[index - 1]);
      const debitThisMonth = selectedYearTransactions
        .filter(transaction => transaction.month === entryMonth)
        .filter(trans => trans.transactionPurpose === 'MDM WITHDRAWAL');
      // const thisMonthTransaction = transactionState.filter(
      //   (transaction) => transaction.id === entry.id
      // )[0];

      if (debitThisMonth.length > 0) {
        setThisMonthFromTransaction(debitThisMonth[0]);
      }
      const creditTrThisMonth = selectedYearTransactions
        .filter(trmonth => trmonth.month === month)
        .filter(trtype => trtype.type === 'CREDIT');

      if (creditTrThisMonth.length > 0) {
        setFtFound(true);
        setThisMonthFromFirstTransaction(creditTrThisMonth[0]);
        let cBalRCThisMonth = 0;
        let cPryRCThisMonth = 0;
        creditTrThisMonth.forEach(tr => {
          cBalRCThisMonth += tr.ppRC;
          cPryRCThisMonth += tr.pryRC;
        });
        setBalRCThisMonth(cBalRCThisMonth);
        setPryRCThisMonth(cPryRCThisMonth);
      } else {
        setFtFound(false);
      }
      const thisMonthName = entry.month;
      const prevMonthName = months[months.indexOf(thisMonthName) - 1];
      const creditTrPrevMonth = selectedYearTransactions
        .filter(trmonth => trmonth.month === prevMonthName)
        .filter(trtype => trtype.type === 'CREDIT');

      if (creditTrPrevMonth.length > 0) {
        let cBalPrevMonth = 0;
        let cPryPrevMonth = 0;
        creditTrPrevMonth.forEach(tr => {
          cBalPrevMonth += tr.ppRC;
          cPryPrevMonth += tr.pryRC;
        });
        setBalRCPrevMonth(cBalPrevMonth);
        setPryRCPrevMonth(cPryPrevMonth);
      }
    });
    setFilteredData(x);
    setFilteredRiceData(
      y.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date)),
      ),
    );

    let riceGiven = 0;
    let thisMonthRiceData = y.sort(
      (a, b) =>
        Date.parse(getCurrentDateInput(a.date)) -
        Date.parse(getCurrentDateInput(b.date)),
    );
    y.map(entry => {
      riceGiven += entry.riceGiven;
    });
    setTotalRiceGiven(riceGiven);
    let ppTotal = 0;
    let pryTotal = 0;
    x.map(entry => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });

    const entryMonth = x[0]?.date?.split('-')[1];
    let mdmCost = PREV_MDM_COST;
    if (parseInt(selectedYear) <= 2024 && parseInt(entryMonth) <= 11) {
      setThisMonthMDMAllowance(PREV_MDM_COST);
      mdmCost = PREV_MDM_COST;
    } else {
      setThisMonthMDMAllowance(MDM_COST);
      mdmCost = MDM_COST;
    }
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);
    setMonthYearID(`${month.monthName}-${selectedYear}`);
    setMonthToSubmit(month.monthName);
    setMonthWorkingDays(x.length);

    setMonthPPTotal(ppTotal);
    setMonthlyPPCost(Math.round(ppTotal * mdmCost));
    setMonthPRYTotal(pryTotal);
    setThisMonthTotalCost(Math.round((ppTotal + pryTotal) * mdmCost));
    setMonthlyPRYCost(
      Math.round((ppTotal + pryTotal) * mdmCost) -
        Math.round(ppTotal * mdmCost),
    );
    setMonthRiceOB(thisMonthRiceData[0]?.riceOB);
    setMonthRiceCB(thisMonthRiceData[0]?.riceCB);
    setMonthRiceGiven(riceGiven);
    setMonthRiceCB(thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB);
    setThisMonthTotalRiceConsumption(
      thisMonthRiceData[0]?.riceOB +
        riceGiven -
        thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB,
    );
    setShowDataTable(true);
    setMonthText(month.monthName);
  };

  const submitRice = async () => {
    setLoader(true);
    try {
      await firestore()
        .collection('rice')
        .doc(date)
        .set({
          id: date,
          date: date,
          riceOB: riceOB,
          riceGiven: riceGiven === '' ? 0 : riceGiven,
          riceExpend: riceExpend,
          riceCB: riceCB,
        })
        .then(() => {
          showToast('success', 'Rice Data added successfully');
          setRiceGiven(0);
          setRiceOB(riceCB);
          let x = riceState;
          x = [
            ...x,
            {
              id: date,
              date: date,
              riceOB: riceOB,
              riceGiven: riceGiven === '' ? 0 : riceGiven,
              riceExpend: riceExpend,
              riceCB: riceCB,
            },
          ].sort(
            (a, b) =>
              Date.parse(getCurrentDateInput(a.date)) -
              Date.parse(getCurrentDateInput(b.date)),
          );
          setRiceState(x);
          setRiceData(x);
          // getRiceData();
          setDocId(todayInString());
          setDate(todayInString());
          setRiceExpend('');
          setRiceGiven('');
          setShowRiceData(false);
          setShowEntry(false);
          setShowDataTable(false);
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
          setLoader(false);
          setRiceDone(true);
        })
        .catch(e => {
          console.log(e);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      const entry = {
        id: monthYearID,
        month: monthToSubmit,
        year: selectedYear.toString(),
        financialYear: financialYear,
        worrkingDays: monthWorkingDays,
        totalWorkingDays: totalWorkingDays,
        ppTotal: monthPPTotal,
        pryTotal: monthPRYTotal,
        monthlyPPCost: monthlyPPCost,
        monthlyPRYCost: monthlyPRYCost,
        totalCost: monthTotalCost,
        ricePPOB,
        ricePryOB,
        riceOB: monthRiceOB,
        ricePPRC,
        ricePryRC,
        ricePPEX,
        ricePryEX,
        ricePPCB,
        ricePryCB,
        riceCB: monthRiceCB,
        riceConsunption: monthRiceConsunption,
        riceGiven: monthRiceGiven,
        remarks: remarks,
        date: todayInString(),
      };
      await firestore()
        .collection('mothlyMDMData')
        .doc(monthYearID)
        .set(entry)
        .then(() => {
          showToast('success', 'Monthly MDM Data Submitted successfully');
          setLoader(false);
          setMonthlyReportState();
          let z = monthlyReportState.filter(item => item.id !== monthYearID);
          z = [...z, entry];
          setMonthlyReportState(sortMonthwise(z));
          setShowSubmitMonthlyReport(false);
        })
        .catch(e => {
          console.log(e);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const showConfirmDialog = entry => {
    return Alert.alert('Hold On!', 'Are You Sure? This Entry Will be Deleted', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'Cancel',
        onPress: () => showToast('success', 'Entry Not Deleted'),
      }, // The "Yes" button
      {
        text: 'Yes',
        onPress: async () => {
          await delEntry(entry);
        },
      },
    ]);
  };
  const delEntry = async entry => {
    try {
      setLoader(true);
      await firestore()
        .collection('mdmData')
        .doc(entry.id)
        .delete()
        .then(async () => {
          try {
            await firestore()
              .collection('rice')
              .doc(entry.id)
              .delete()
              .then(() => {
                const filteredEntry = riceState.filter(
                  el => el.id !== entry.id,
                );
                const thisEntry = riceState.filter(el => el.id === entry.id)[0];
                setRiceState(filteredEntry);
                setRiceOB(thisEntry?.riceOB);
                setRiceCB(thisEntry?.riceOB);
                setRiceState(filteredEntry);
                setRiceData(filteredEntry);
              })
              .catch(err => {
                console.log('Rice Data not Found', err);
                showToast('error', 'Rice Data not Found');
              });
          } catch (error) {
            console.log('Rice Data not Found', error);
            showToast('error', 'Rice Data not Found');
          }
          setLoader(false);
          showToast('success', 'MDM Data Deleted successfully');
          const filteredEntry = mealState.filter(el => el.id !== entry.id);
          setMealState(filteredEntry);
          setAllEnry(filteredEntry);
          findRiceEntry(filteredEntry);
          setMoreFilteredData(
            moreFilteredData.filter(el => el.id !== entry.id),
          );
          setFilteredData(filteredData.filter(el => el.id !== entry.id));
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
          setShowDataTable(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
          showToast('error', 'Something went Wrong!');
        });
    } catch (e) {
      console.log(e);
      setLoader(false);
      showToast('error', 'Something went Wrong!');
    }
  };
  const getArrayLength = year => {
    let x = [];
    allEnry.map(entry => {
      const entryYear = entry.id?.split('-')[2];
      if (entryYear === year) {
        x.push(entry);
      }
    });
    return x.length;
  };
  useEffect(() => {}, [
    allEnry,
    filteredData,
    pp,
    pry,
    date,
    ppTotalMeal,
    pryTotalMeal,
    docId,
    riceOB,
    monthYearID,
    financialYear,
    monthlyPPCost,
    monthlyPRYCost,
    filteredRiceData,
  ]);
  useEffect(() => {
    if (riceState.length === 0) {
      getRiceData();
    } else {
      setRiceData(riceState);
      setRiceOB(riceState[riceState.length - 1].riceCB);
      setRiceCB(riceState[riceState.length - 1].riceCB);
      findRiceEntry(riceState);
      setLoader(false);
    }
    if (mealState.length === 0) {
      getMainData();
    } else {
      setAllEnry(mealState);
      findMDMEntry(mealState);
      setLoader(false);
    }
    getTransactions();
    if (monthlyReportState.length === 0) {
      getMonthlyData();
    } else {
      setMonthlyReportData(monthlyReportState);
      setLoader(false);
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
      <Loader visible={loader} />
      <Text style={styles.title}>MDM DATA OF {SCHOOLNAME}</Text>
      <ScrollView
        style={{
          marginBottom: responsiveHeight(2),
        }}>
        {!showEntry && !showUpdate && !showMonthlyReport && !showRiceData && (
          <View>
            <CustomButton
              title={'Coverage Entry'}
              color={mdmDone ? 'red' : 'green'}
              onClick={() => {
                allEnry.map(entry => {
                  if (entry.date === todayInString()) {
                    showToast('error', 'Todays Entry Already Done!');
                    setPp(entry.pp);
                    setPry(entry.pry);
                  } else {
                    setPp('');
                    setPry('');
                    setErrPP('');
                    setErrPry('');
                  }
                });
                setShowEntry(true);
                setShowUpdate(false);
                setShowMonthlyReport(false);
                setDate(todayInString());
                setShowDataTable(false);
                setShowMonthSelection(false);
                setShowRiceData(false);
              }}
            />
            <CustomButton
              color={!mdmDone ? 'red' : 'green'}
              title={'Coverage Update'}
              onClick={() => {
                searchTodaysData();
              }}
            />
            <CustomButton
              title={'Monthly Report'}
              onClick={() => calledData(allEnry)}
            />
            <CustomButton
              title={'Rice Data'}
              color={riceDone ? 'red' : 'green'}
              onClick={() => {
                if (riceDone) {
                  showToast('error', 'Todays Rice Entry Already Done!');
                }
                setShowRiceData(true);
                setShowMonthlyReport(false);
                setShowDataTable(false);
                setShowMonthSelection(false);
                setShowEntry(false);
                setShowUpdate(false);
                setDate(todayInString());
                setDocId(todayInString());
              }}
            />
          </View>
        )}
        {showEntry && (
          <ScrollView>
            <Text style={styles.title}>Coverage Entry</Text>
            <View style={{marginVertical: responsiveHeight(1)}}>
              <Text style={styles.label}>Date*</Text>
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
                  {currentDate.getDate() < 10
                    ? '0' + currentDate.getDate()
                    : currentDate.getDate()}
                  -
                  {currentDate.getMonth() + 1 < 10
                    ? `0${currentDate.getMonth() + 1}`
                    : currentDate.getMonth() + 1}
                  -{currentDate.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={currentDate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay}
                />
              )}
            </View>
            <CustomTextInput
              title={'PP'}
              type={'number-pad'}
              placeholder={`Max Limit: ${PP_STUDENTS}`}
              value={pp.toString()}
              onChangeText={text => {
                if (text.length) {
                  if (text > PP_STUDENTS) {
                    showToast('error', 'PP Limit Exceeded!');
                    setPp(PP_STUDENTS);
                  } else {
                    setPp(parseInt(text));
                  }
                } else {
                  setPp('');
                }
              }}
            />
            {errPP && <Text style={styles.error}>{errPP}</Text>}
            <CustomTextInput
              title={'Primary'}
              type={'number-pad'}
              placeholder={`Max Limit: ${PRIMARY_STUDENTS}`}
              value={pry.toString()}
              onChangeText={text => {
                if (text.length) {
                  if (text > PRIMARY_STUDENTS) {
                    showToast('error', 'Primary Limit Exceeded!');
                    setPry(PRIMARY_STUDENTS);
                  } else {
                    setPry(parseInt(text));
                  }
                } else {
                  setPry('');
                }
              }}
            />
            {errPry && <Text style={styles.error}>{errPry}</Text>}
            <CustomButton
              title={'Submit'}
              onClick={() => {
                setShowEntry(false);
                submitData();
              }}
            />
            <CustomButton
              title={'Cancel'}
              color={'red'}
              onClick={() => {
                setShowEntry(false);
              }}
            />
          </ScrollView>
        )}
        {showUpdate && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}>
            <Text style={styles.title}>Coverage Update</Text>
            <View style={{marginVertical: responsiveHeight(1)}}>
              <View style={{marginVertical: responsiveHeight(1)}}>
                <Text style={styles.label}>Date*</Text>
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
                    {currentDate.getDate() < 10
                      ? '0' + currentDate.getDate()
                      : currentDate.getDate()}
                    -
                    {currentDate.getMonth() + 1 < 10
                      ? `0${currentDate.getMonth() + 1}`
                      : currentDate.getMonth() + 1}
                    -{currentDate.getFullYear()}
                  </Text>
                </TouchableOpacity>
                {open && (
                  <DateTimePickerAndroid
                    testID="dateTimePicker"
                    value={currentDate}
                    mode="date"
                    maximumDate={Date.parse(new Date())}
                    // minimumDate={date}
                    display="default"
                    onChange={calculateAgeOnSameDay2}
                  />
                )}
              </View>
              <CustomTextInput
                title={'PP'}
                placeholder={`Max Limit: ${PP_STUDENTS}`}
                value={pp.toString()}
                onChangeText={text => {
                  if (text.length) {
                    if (text > PP_STUDENTS) {
                      showToast('error', 'PP Limit Exceeded!');
                      setPp(PP_STUDENTS);
                    } else {
                      setPp(parseInt(text));
                    }
                  } else {
                    setPp('');
                  }
                }}
              />
              {errPP && <Text style={styles.error}>{errPP}</Text>}
              <CustomTextInput
                title={'Primary'}
                placeholder={`Max Limit: ${PRIMARY_STUDENTS}`}
                value={pry.toString()}
                onChangeText={text => {
                  if (text.length) {
                    if (text > PRIMARY_STUDENTS) {
                      showToast('error', 'Primary Limit Exceeded!');
                      setPry(PRIMARY_STUDENTS);
                    } else {
                      setPry(parseInt(text));
                    }
                  } else {
                    setPry('');
                  }
                }}
              />
              {errPry && <Text style={styles.error}>{errPry}</Text>}
              <CustomButton
                title={'Submit'}
                onClick={() => {
                  setShowEntry(false);
                  updateData();
                }}
              />
              <CustomButton
                title={'Cancel'}
                color={'red'}
                onClick={() => {
                  setShowUpdate(false);
                  setDocId(todayInString());
                  setPp('');
                  setPry('');
                  setDate(todayInString());
                }}
              />
            </View>
          </ScrollView>
        )}
        {showMonthlyReport && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}>
            <Text style={styles.title}>Monthly Report</Text>
            {serviceArray.length > 0 && (
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
              {serviceArray.length > 0 &&
                serviceArray.map((year, index) => (
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
                      onClick={() => {
                        handleChange(year);
                        if (showMonthSelection) {
                          setShowMonthSelection(false);
                          setShowDataTable(false);
                        }
                      }}
                    />
                    <View
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
                          ? new Date().getFullYear() - parseInt(year) + ' Years'
                          : new Date().getFullYear() - parseInt(year) === 1
                          ? new Date().getFullYear() - parseInt(year) + ' Year'
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
                          `${getArrayLength(year) > 1 ? ' Entries' : ' Entry'}`}
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
                          flexWrap: 'wrap',
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
                          {moreFilteredData.filter(
                            m => m.date.split('-')[1] === month.index,
                          ).length +
                            ` ${
                              moreFilteredData.filter(
                                m => m.date.split('-')[1] === month.index,
                              ).length > 1
                                ? ' Entries'
                                : ' Entry'
                            }`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {showDataTable && (
              <ScrollView
                style={{
                  marginBottom: responsiveHeight(2),
                }}>
                <Text
                  style={[styles.title, {marginVertical: responsiveHeight(1)}]}>
                  Mothly MDM Report of {monthText} Month
                </Text>
                {showDownloadButton && (
                  <CustomButton
                    marginTop={responsiveHeight(1)}
                    color={'blueviolet'}
                    title={`Download ${monthToSubmit} ${selectedYear} MDM PDF`}
                    onClick={async () => {
                      const data = {
                        ftFound: ftFound,
                        thisMonthlyData: thisMonthlyData,
                        thisMonthFromFirstTransaction:
                          thisMonthFromFirstTransaction,
                        thisMonthFromTransaction: thisMonthFromTransaction,
                        prevMonthlyData: prevMonthlyData,
                        balRCThisMonth: balRCThisMonth,
                        pryRCThisMonth: pryRCThisMonth,
                        balRCPrevMonth: balRCPrevMonth,
                        pryRCPrevMonth: pryRCPrevMonth,
                        remarks: remarks,
                        mdmCost: thisMonthMDMAllowance,
                      };
                      await Linking.openURL(
                        `${WEBSITE}/downloadMDMReport?data=${JSON.stringify(
                          data,
                        )}`,
                      );
                    }}
                  />
                )}
                {filteredData.length > 0 ? (
                  filteredData.map((entry, index) => {
                    return (
                      <React.Fragment key={index}>
                        <View style={styles.dataView}>
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text selectable style={styles.bankDataText}>
                              Day: {index + 1}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Date: {entry.date}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              PP: {entry.pp}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Primary: {entry.pry}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Rice: {filteredRiceData[index]?.riceExpend} Kg.
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignSelf: 'center',
                              }}>
                              <View
                                style={{marginHorizontal: responsiveWidth(2)}}>
                                <CustomButton
                                  title={'Edit'}
                                  size={'xsmall'}
                                  color={'darkorange'}
                                  onClick={() => {
                                    setPp(entry.pp);
                                    setPry(entry.pry);
                                    setDate(getCurrentDateInput(entry.date));
                                    setCurrentDate(
                                      new Date(getCurrentDateInput(entry.date)),
                                    );
                                    setDocId(entry.date);
                                    setLoader(false);
                                    setShowEntry(false);
                                    setShowUpdate(true);
                                    setShowMonthlyReport(false);
                                    setShowDataTable(false);
                                    setShowMonthSelection(false);
                                  }}
                                />
                              </View>
                              <View
                                style={{marginHorizontal: responsiveWidth(2)}}>
                                <CustomButton
                                  title={'Delete'}
                                  size={'xsmall'}
                                  color={'red'}
                                  onClick={() => showConfirmDialog(entry)}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                        {filteredData.length === index + 1 && (
                          <View
                            style={[
                              styles.dataView,
                              {backgroundColor: 'lightgoldenrodyellow'},
                            ]}>
                            <Text selectable style={styles.bankDataText}>
                              Total
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Total MDM Days:{' '}
                              {filteredData.length > 1
                                ? `${filteredData.length} Days`
                                : `${filteredData.length} Day`}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              PP Total Meal: {ppTotalMeal}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Primary Total Meal: {pryTotalMeal}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Total Meal- {ppTotalMeal + pryTotalMeal}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              MDM Cost ={' '}
                              {`${ppTotalMeal} X ₹ ${thisMonthMDMAllowance} + ${pryTotalMeal} X ₹${thisMonthMDMAllowance} = `}
                              ₹ {IndianFormat(thisMonthTotalCost)}
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Total Rice Given: {totalRiceGiven}Kg.
                            </Text>
                            <Text selectable style={styles.bankDataText}>
                              Rice Consumption: {thisMonthTotalRiceConsumption}
                              Kg.
                            </Text>
                          </View>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Text selectable style={styles.bankDataText}>
                    No Entry found for the selected Year.
                  </Text>
                )}
                <View style={{marginVertical: responsiveHeight(1)}}>
                  {!showSubmitMonthlyReport ? (
                    <CustomButton
                      title={'Submit Monthly Report'}
                      color={'green'}
                      onClick={() => {
                        setShowSubmitMonthlyReport(true);
                        const thisMonthlyData = monthlyReportState.filter(
                          data => data.id === monthYearID,
                        );
                        if (thisMonthlyData.length > 0) {
                          filterMonthlyData(thisMonthlyData[0]);
                        }
                      }}
                    />
                  ) : (
                    <View style={{marginVertical: responsiveHeight(2)}}>
                      <Text style={styles.title}>Submit Monthly Report</Text>
                      <CustomTextInput
                        title={'Month Name'}
                        placeholder={`Enter Month Name`}
                        value={monthToSubmit}
                        onChangeText={text => {
                          setMonthToSubmit(text);
                        }}
                      />
                      <CustomTextInput
                        title={'Total MDM Days'}
                        type={'number-pad'}
                        placeholder={`Enter Total MDM Days`}
                        value={monthWorkingDays.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthWorkingDays(parseInt(text));
                          } else {
                            setMonthWorkingDays('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Working Days'}
                        type={'number-pad'}
                        placeholder={`Enter Total Working Days`}
                        value={totalWorkingDays.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setTotalWorkingDays(parseInt(text));
                          } else {
                            setTotalWorkingDays('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total PP Meals'}
                        type={'number-pad'}
                        placeholder={`Enter Total PP Meals`}
                        value={monthPPTotal.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthPPTotal(parseInt(text));
                          } else {
                            setMonthPPTotal('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Primary Meals'}
                        type={'number-pad'}
                        placeholder={`Enter Total Primary Meals`}
                        value={monthPRYTotal.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthPRYTotal(parseInt(text));
                          } else {
                            setMonthPRYTotal('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total PP MDM Cost'}
                        type={'number-pad'}
                        placeholder={`Enter Total PP MDM Cost`}
                        value={monthlyPPCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthlyPPCost(parseInt(text));
                          } else {
                            setMonthlyPPCost('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total PRIMARY MDM Cost'}
                        type={'number-pad'}
                        placeholder={`Enter Total PRIMARY MDM Cost`}
                        value={monthlyPRYCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthlyPRYCost(parseInt(text));
                          } else {
                            setMonthlyPRYCost('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total MDM Cost'}
                        type={'number-pad'}
                        placeholder={`Enter Total MDM Cost`}
                        value={monthTotalCost.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthTotalCost(parseInt(text));
                          } else {
                            setMonthTotalCost('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Opening Balance`}
                        value={ricePPOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPOB(parseInt(text));
                          } else {
                            setRicePPOB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Opening Balance`}
                        value={ricePryOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryOB(parseInt(text));
                          } else {
                            setRicePryOB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Opening Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Opening Balance`}
                        value={monthRiceOB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceOB(parseInt(text));
                          } else {
                            setMonthRiceOB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Received`}
                        value={ricePPRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPRC(parseInt(text));
                          } else {
                            setRicePPRC('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Received`}
                        value={ricePryRC.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryRC(parseInt(text));
                          } else {
                            setRicePryRC('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Received'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Received`}
                        value={monthRiceGiven.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceGiven(parseInt(text));
                          } else {
                            setMonthRiceGiven('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Consumption'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Consumption`}
                        value={ricePPEX.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPEX(parseInt(text));
                          } else {
                            setRicePPEX('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Consumption'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Consumption`}
                        value={ricePryEX.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryEX(parseInt(text));
                          } else {
                            setRicePryEX('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Consumption'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Consumption`}
                        value={monthRiceConsunption.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceConsunption(parseInt(text));
                          } else {
                            setMonthRiceConsunption('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'PP Rice Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter PP Rice Closing Balance`}
                        value={ricePPCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePPCB(parseInt(text));
                          } else {
                            setRicePPCB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Primary Rice Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Primary Rice Closing Balance`}
                        value={ricePryCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setRicePryCB(parseInt(text));
                          } else {
                            setRicePryCB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Total Rice Closing Balance'}
                        type={'number-pad'}
                        placeholder={`Enter Total Rice Closing Balance`}
                        value={monthRiceCB.toString()}
                        onChangeText={text => {
                          if (text !== '') {
                            setMonthRiceCB(parseInt(text));
                          } else {
                            setMonthRiceCB('');
                          }
                        }}
                      />
                      <CustomTextInput
                        title={'Remarks'}
                        size={'large'}
                        placeholder={`Enter Remarks`}
                        value={remarks}
                        onChangeText={text => {
                          setRemarks(text);
                        }}
                      />
                      <CustomButton
                        marginTop={responsiveHeight(1)}
                        color={'green'}
                        title={'Submit'}
                        onClick={() => submitMonthlyData()}
                      />
                      <CustomButton
                        marginTop={responsiveHeight(1)}
                        color={'red'}
                        title={'Cancel'}
                        onClick={() => setShowSubmitMonthlyReport(false)}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
            <CustomButton
              marginTop={responsiveHeight(1)}
              color={'red'}
              title={'Close'}
              onClick={() => setShowMonthlyReport(false)}
            />
          </ScrollView>
        )}
        {showRiceData && (
          <ScrollView
            style={{
              marginBottom: responsiveHeight(2),
            }}>
            <Text style={styles.title}>Rice Data</Text>
            <View style={{marginVertical: responsiveHeight(1)}}>
              <Text style={styles.label}>Date*</Text>
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
                  {currentDate.getDate() < 10
                    ? '0' + currentDate.getDate()
                    : currentDate.getDate()}
                  -
                  {currentDate.getMonth() + 1 < 10
                    ? `0${currentDate.getMonth() + 1}`
                    : currentDate.getMonth() + 1}
                  -{currentDate.getFullYear()}
                </Text>
              </TouchableOpacity>
              {open && (
                <DateTimePickerAndroid
                  testID="dateTimePicker"
                  value={currentDate}
                  mode="date"
                  maximumDate={Date.parse(new Date())}
                  // minimumDate={date}
                  display="default"
                  onChange={calculateAgeOnSameDay3}
                />
              )}
            </View>
            <Text style={styles.label}>Rice Opening Balance {riceOB} Kg.</Text>
            <CustomTextInput
              title={'Rice Opening Balance (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Opening Balance (in Kg.)`}
              value={riceOB.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceOB(parseInt(text));
                  setRiceCB(
                    parseInt(text) +
                      (riceGiven === '' ? 0 : riceGiven) -
                      (riceExpend === '' ? 0 : riceExpend),
                  );
                } else {
                  setRiceOB('');
                }
              }}
            />
            <CustomTextInput
              title={'Rice Expenditure (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Expenditure (in Kg.)`}
              value={riceExpend.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceExpend(parseInt(text));
                  setRiceCB(
                    riceOB -
                      (riceGiven === '' ? 0 : riceGiven) -
                      parseInt(text),
                  );
                } else {
                  setRiceExpend('');
                }
              }}
            />
            {errRice && <Text style={styles.error}>{errRice}</Text>}
            <CustomTextInput
              title={'Rice Received (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Received (in Kg.)`}
              value={riceGiven.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceGiven(parseInt(text));
                  setRiceCB(riceOB + parseInt(text) - riceExpend);
                } else {
                  setRiceGiven('');
                  setRiceCB(riceOB - riceExpend);
                }
              }}
            />

            <CustomTextInput
              title={'Rice Closing Balance (in Kg.)'}
              type={'number-pad'}
              placeholder={`Enter Rice Closing Balance (in Kg.)`}
              value={riceCB.toString()}
              onChangeText={text => {
                if (text !== '') {
                  setRiceCB(parseInt(text));
                } else {
                  setRiceCB('');
                }
              }}
            />
            <Text style={styles.label}>Closing Balance {riceCB} Kg.</Text>

            <CustomButton
              marginTop={responsiveHeight(1)}
              color={'green'}
              title={'Submit'}
              onClick={() => {
                if (riceExpend === 0 || riceExpend === '') {
                  setErrRice('Please Enter Rice Expenditure');
                  return;
                }
                setErrRice('');
                submitRice();
              }}
            />
            <CustomButton
              marginTop={responsiveHeight(1)}
              color={'red'}
              title={'Close'}
              onClick={() => {
                setShowRiceData(false);
              }}
            />
          </ScrollView>
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
