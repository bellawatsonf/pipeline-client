export function toString(data) {
  let date = new Date(data);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  // return dt + "/" + month + "/" + year;
  return year + "-" + month + "-" + dt;
}
