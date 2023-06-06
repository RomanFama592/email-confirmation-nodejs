import moment from "moment-timezone";

export default function logger(...output) {
  const time = new Date().getTime();
  console.log(...output, " :: ", new Date(time));
}
