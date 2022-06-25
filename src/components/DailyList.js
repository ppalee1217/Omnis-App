import { ScrollView } from "react-native";
import DailyRecord from "./DailyRecord";

function renderExpenseItem(itemData) {
  return <ExpenseItem {...itemData.item} />;
}

function DailyList(props) {
  //console.log(props.list)
  return (
    <DailyRecord
      toDayCO2={props.data.toDayco2}
      yesterDayCO2={props.data.yesterDayco2}
      date={props.data.date}
      yesterDayPosition={props.data.yesterDayPosition}
      nowPosition={props.data.nowPosition}
      todayRPM={props.data.rpm}
      waveHeight={props.data.AWH}
      windSpeed={props.data.wind}
      AWT={props.data.AWT}
    />
  );
}

export default DailyList;
