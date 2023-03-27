export function FormatRupiah(param) {
  console.log(param, "paramrupiah");
  var number_string = param.toString();
  var sisa = number_string.length % 3;
  var rupiah = number_string.substr(0, sisa);
  var ribuan = number_string.substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }
  console.log(rupiah, "rupiah");
  let hasil = rupiah;
  console.log(rupiah, "datainrupiah");
  return hasil;
}
