const PHONE_REGEX = /^(?:\+251|0)[97]\d{8}$/;

export function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Enter a valid TeleBirr number (e.g. 09XXXXXXXX or +2519XXXXXXXX).";
  }

  if (!form.area) {
    errors.area = "Select a delivery area.";
  }

  return errors;
}
