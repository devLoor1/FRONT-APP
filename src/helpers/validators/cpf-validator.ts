const CPFValidator = {
  digit(partial: number[]): number {
    const remainder =
      partial
        .map((value, index) => (partial.length + 1 - index) * value)
        .reduce((accumulator, value) => accumulator + value, 0) % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  },
  validate(cpf: string): boolean {
    if (!cpf) return false;

    const numberSomething = cpf;

    if (numberSomething.length !== 11) {
      return false;
    }

    const numbers = numberSomething.split('').map((char): number => parseInt(char, 10));

    if (numbers.every(value => value === numbers[0])) {
      return false;
    }

    if (numbers[9] !== CPFValidator.digit(numbers.slice(0, 9))) {
      return false;
    }

    if (numbers[10] !== CPFValidator.digit(numbers.slice(0, 10))) {
      return false;
    }

    return true;
  },
};

export default CPFValidator;
