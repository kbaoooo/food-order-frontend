const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0, // Số chữ số sau dấu phẩy
});

export const formatCurrency = (amount) => {
  return formatter.format(amount);
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

export const formatDate = (date) => {
  const dateObj = new Date(date);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export function convertNumberToWords(n) {
  const units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const hundreds = [
    "",
    "một trăm",
    "hai trăm",
    "ba trăm",
    "bốn trăm",
    "năm trăm",
    "sáu trăm",
    "bảy trăm",
    "tám trăm",
    "chín trăm",
  ];

  if (n === 0) return "không đồng";

  function readTriple(triple) {
    let hundred = Math.floor(triple / 100);
    let ten = Math.floor((triple % 100) / 10);
    let unit = triple % 10;
    let result = "";

    if (hundred !== 0) {
      result += hundreds[hundred] + " ";
    }

    if (ten !== 0 || unit !== 0) {
      if (ten === 1) {
        result += "mười ";
        if (unit === 5) result += "lăm";
        else if (unit !== 0) result += units[unit];
      } else {
        if (ten === 0) {
          result += tens[ten] + " lẻ ";
        } else {
          result += tens[ten] + " ";
        }
        if (unit !== 0) {
          if (unit === 1 && ten !== 0) result += "mốt";
          else if (unit === 5 && ten !== 0) result += "lăm";
          else result += units[unit];
        }
      }
    }
    return result.trim();
  }

  function splitNumberToTriples(n) {
    let triples = [];
    while (n > 0) {
      triples.push(n % 1000);
      n = Math.floor(n / 1000);
    }
    return triples.reverse();
  }

  const groups = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"];
  let triples = splitNumberToTriples(n);
  let result = "";

  triples.forEach((triple, index) => {
    if (triple !== 0) {
      result +=
        readTriple(triple) + " " + groups[triples.length - 1 - index] + " ";
    }
  });

  return result.trim() + " đồng";
}

export const formatPercent = (percent) => {
  return `${parseInt(percent)}%`;
};

export const formatPhoneNumber = (phone) => {
  if (phone?.startsWith("0")) {
    const formattedPhone = `(+84) ${phone.slice(1)}`;
    return formattedPhone;
  }
  return phone;
};

export function customRound(num) {
  let decimalPart = num % 1; 

  if (decimalPart < 0.5) {
    return +Math.floor(num);
  } else if (decimalPart > 0.5) {
    return +Math.ceil(num);
  } else {
    return +num;
  }
}
