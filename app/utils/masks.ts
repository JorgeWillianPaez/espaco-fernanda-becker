// Utilitários de máscaras para inputs

export const maskCPF = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const maskRG = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{1})\d+?$/, "$1");
};

export const maskPhone = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

export const maskCEP = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export const maskTime = (value: string): string => {
  // Remove tudo que não é número
  let numbers = value.replace(/\D/g, "");

  // Limita a 4 dígitos
  numbers = numbers.slice(0, 4);

  if (numbers.length === 0) return "";

  // Valida e formata
  let hours = "";
  let minutes = "";

  if (numbers.length >= 1) {
    // Primeiro dígito da hora
    const firstDigit = parseInt(numbers[0]);
    if (firstDigit > 2) {
      // Se primeiro dígito > 2, assume 0X
      hours = "0" + numbers[0];
      numbers = numbers.slice(1);
    } else {
      hours = numbers[0];
      numbers = numbers.slice(1);
    }
  }

  if (numbers.length >= 1 && hours.length === 1) {
    // Segundo dígito da hora
    const twoDigitHour = parseInt(hours + numbers[0]);
    if (twoDigitHour <= 23) {
      hours += numbers[0];
      numbers = numbers.slice(1);
    } else {
      // Hora inválida, ignora
      hours = hours;
    }
  }

  if (numbers.length >= 1) {
    // Primeiro dígito do minuto
    const firstMinDigit = parseInt(numbers[0]);
    if (firstMinDigit > 5) {
      minutes = "0" + numbers[0];
      numbers = numbers.slice(1);
    } else {
      minutes = numbers[0];
      numbers = numbers.slice(1);
    }
  }

  if (numbers.length >= 1 && minutes.length === 1) {
    // Segundo dígito do minuto
    minutes += numbers[0];
  }

  // Monta o resultado
  if (hours.length === 2 && minutes.length > 0) {
    return hours + ":" + minutes;
  } else if (hours.length === 2) {
    return hours + ":";
  } else {
    return hours;
  }
};

// Funções para remover máscaras (limpar antes de enviar ao backend)
export const removeMask = (value: string | null | undefined): string => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};
