import {
  ScrollView
} from "react-native";
import DailyRecord from "./DailyRecord";

function DailyList(props) {
  return (
    <ScrollView>
      {props.list.map((d, index) => {
        <DailyRecord num={index} data={d}/>
      })}
    </ScrollView>
  );
}

export default DailyList;
