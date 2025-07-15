const CommonMask = {
  cpf(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d)(\d{2})$/, "$1-$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    } else {
      value = value.replace(/\D/g, "");
      value = value.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
    return value;
  },
  cnpj(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
    return value;
  },
  cep(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    return value;
  },
  phone(value: string) {
    const regex = /^\+(\d{2})(\d{2})(\d{5})(\d{4})$/;
    const match = value.match(regex);

    if (match) {
      return value.replace(
        /^\+(\d{2})(\d{2})(\d{5})(\d{4})$/,
        "+$1 ($2) $3-$4"
      );
    }

    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  },
  currency(value: string) {
    if (value === "0") {
      value = "0,00";
    } else {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{2})$/, "$1,$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }
    return value;
  },
  currencyUS(value: string) {
    if (value === "0") {
      value = "0.00";
    } else {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d)(\d{2})$/, "$1.$2");
      value = value.replace(/(?=(\d{3})+(\D))\B/g, ",");
    }
    return value;
  },
  currencyK(value: number) {
    if (value > 999 && value < 1000000) {
      return `R$${(value / 1000).toFixed(1).replace(".", ",")}K`; // convert to K for number from > 1000 < 1 million
    }
    if (value >= 1000000) {
      return `R$${(value / 1000000).toFixed(1).replace(".", ",")}KK`; // convert to M for number from > 1 million
    }
    if (value <= 999) {
      const maskNumber = `R$${CommonMask.currency(
        value.toFixed(2).toString()
      )}`;
      return maskNumber; // if value < 1000, nothing to do
    }

    return value;
  },
  currencyM(value: number) {
    if (value > 999 && value < 1000000) {
      return `R$ ${(value / 1000).toFixed(1).replace(".", ",")}mil`;
    }
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1).replace(".", ",")}milhões`;
    }
    if (value <= 999) {
      const maskNumber = `R$ ${CommonMask.currency(
        value.toFixed(2).toString()
      )}`;
      return maskNumber; // if value < 1000, nothing to do
    }

    return value;
  },
  percent(value: string) {
    if (value === "0") {
      value = "0,00";
    } else {
      value = value.replace(".", ",");
      value = value.replace(/^(\d)(\d{2})$/, "$1,$2");
    }
    return value;
  },
  date(value: string) {
    value = value.replace(/\D/g, "");
    const day = value.slice(0, 2);
    const month = value.slice(2, 4);
    const year = value.slice(4, 8);

    if (+day > 31) {
      value = value.replace(day, "31");
    }

    if (+month > 12) {
      value = value.replace(month, "12");
    }

    if (year.length === 4) {
      if (+year < new Date().getFullYear() - 150) {
        value = value.replace(
          year,
          (new Date().getFullYear() - 150).toString()
        );
      }

      if (+year > new Date().getFullYear()) {
        value = value.replace(year, new Date().getFullYear().toString());
      }
    }

    value = value.replace(/^(\d{2})(\d{2})(\d)/, "$1/$2/$3");
    return value;
  },
  email(value: string) {
    var maskedEmail = value.replace(/([^@\.])/g, "*").split("");
    var previous = "";
    for (let i = 0; i < maskedEmail.length; i++) {
      if (i <= 2 || previous === "." || previous === "@") {
        maskedEmail[i] = value[i];
      }
      previous = value[i];
    }
    return maskedEmail.join("");
  },
  hidePhone(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    var maskedEmail = value.replace(/([^-\.])/g, "*").split("");
    for (let i = 0; i < maskedEmail.length; i++) {
      if (i <= 7 || i > 13) {
        maskedEmail[i] = value[i];
      }
    }
    return maskedEmail.join("");
  },
  hideCpf(value: string) {
    value = value.replace(/\D/g, "");

    value = value.replace(/(\d)(\d{2})$/, "$1-$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    var maskedCpf = value.replace(/([^-\.])/g, "*").split("");
    for (let i = 0; i < maskedCpf.length; i++) {
      if (i <= 3 || i > 11) {
        maskedCpf[i] = value[i];
      }
    }

    return maskedCpf.join("");
  },
};

export default CommonMask;
