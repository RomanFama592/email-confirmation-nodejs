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

export default function logger(...output) {
  let msg = formaterTime(new Date()) + " => " + output.join();
  //msg =  msg + "\n" + "-".repeat(msg.length)

  console.log(msg);
}
