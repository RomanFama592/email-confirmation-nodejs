import fs from "fs/promises";

function addZero(number) {
  return number < 10 ? `0${number}` : number;
}

function formaterTime(timeObject) {
  //format: "HH:mm - DD/MM/YY"
  return `${addZero(timeObject.getHours())}:${addZero(
    timeObject.getMinutes()
  )} - ${addZero(timeObject.getDate())}/${addZero(
    timeObject.getMonth() + 1
  )}/${timeObject.getFullYear().toString().slice(2)}`;
}

function saveInTxt(data) {
  fs.appendFile("log.txt", "\n" + data);
}

export default function logger(...output) {
  let msg = formaterTime(new Date()) + " || " + output.join();
  
  saveInTxt(msg);
  
  msg =  msg + "\n" + "-".repeat(msg.length)
  console.log(msg);
}
