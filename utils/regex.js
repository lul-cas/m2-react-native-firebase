const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const regexPhone = /^\(\d{2}\) \d{5}-\d{4}$/;
const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;
const regexValue = /^\d+(\.\d{1,2})?$/;

export { regexEmail, regexPassword, regexPhone, regexDate, regexValue };
