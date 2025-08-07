import CPFValidator from './cpf-validator';

const CommonValidators = {
  isCPFValid(cpf: string): { status: boolean; error: string } {
    if (cpf.length < 1) {
      return { status: false, error: 'CPF obrigatório!' };
    }

    const validator = CPFValidator.validate(cpf);
    if (validator) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'CPF inválido.' };
  },
  isNameValid(name: string): { status: boolean; error: string } {
    if (name.length < 1) {
      return { status: false, error: 'Nome obrigatório!' };
    }
    if (name && name.split(' ').length > 1 && name.length > 5) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'Nome inválido!' };
  },
  isEmailValid(email: string): { status: boolean; error: string } {
    if (email.length < 1) {
      return { status: false, error: 'E-mail obrigatório!' };
    }
    if (email && email.includes('@') && email.includes('.')) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'E-mail inválido!' };
  },
  isPasswordValid(password: string): { status: boolean; error: string } {
    if (password.length < 1) {
      return { status: false, error: 'Senha obrigatória!' };
    }
    if (password.length > 5 && /\d/.test(password) && /[a-zA-Z]/.test(password)) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'Senha inválida!' };
  },
  isPasswordValidOnHandle(password: string): {
    status: boolean;
    error: {
      minLenght: boolean;
      hasNumber: boolean;
      hasUppercase: boolean;
      specialCharacter: boolean;
    };
    msg: string;
  } {
    let status = true;
    let msg = '';
    let error = {
      minLenght: true,
      hasNumber: true,
      hasUppercase: true,
      specialCharacter: true,
    };
    if (password.length < 6) {
      error.minLenght = false;
      status = false;
      msg = 'Senha inválida!';
    }
    if (!/\d/.test(password)) {
      error.hasNumber = false;
      status = false;
      msg = 'Senha inválida!';
    }
    if (!/[A-Z]/.test(password)) {
      error.hasUppercase = false;
      status = false;
      msg = 'Senha inválida!';
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      error.specialCharacter = false;
      status = false;
      msg = 'Senha inválida!';
    }
    return { status, error, msg };
  },
  isConfirmPasswordValid(
    password: string,
    confirmPassword: string
  ): { status: boolean; error: string } {
    if (confirmPassword.length < 1) {
      return { status: false, error: 'Confirmação de senha obrigatória!' };
    }
    if (confirmPassword !== password) {
      return { status: false, error: 'Nova senha e confirmar senha devem ser a mesma!' };
    }
    if (
      password.length > 5 &&
      /\d/.test(password) &&
      /[a-zA-Z]/.test(password) &&
      confirmPassword === password
    ) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'Senha inválida!' };
  },
  isCellphoneValid(cellphone: string): { status: boolean; error: string } {
    if (cellphone.length < 1) {
      return { status: false, error: 'Celular obrigatório!' };
    }

    const numbersOnly = cellphone.replace(/\D/g, '');
    
    if (numbersOnly.length >= 10 && numbersOnly.length <= 11) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'Celular inválido!' };
  },
  isCepValid(cep: string): { status: boolean; error: string } {
    if (cep.length < 1) {
      return { status: false, error: 'CEP obrigatório!' };
    }
    if (cep.length === 8) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'CEP inválido!' };
  },
  isCodeValid(code: string): { status: boolean; error: string } {
    if (code.length < 1) {
      return { status: false, error: 'Código obrigatório!' };
    }
    if (code.length === 6) {
      return { status: true, error: '' };
    }
    return { status: false, error: 'Código inválida!' };
  },
  isEmptyField(
    value: string | null | boolean | undefined,
    label: string
  ): { status: boolean; error: string } {
    if (value === null || value === '') {
      return { status: false, error: `Campo ${label.toLowerCase()} é obrigatório!` };
    } else {
      return { status: true, error: '' };
    }
  },
};

export default CommonValidators;
