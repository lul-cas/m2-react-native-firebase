export const formatCurrency = (rawValue) => {
  const number = Number(rawValue);
  const cents = number / 100;

  return cents.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const formatDate = (raw) => {
  const cleaned = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [];

  if (cleaned.length > 0) parts.push(cleaned.slice(0, 2));
  if (cleaned.length >= 3) parts.push(cleaned.slice(2, 4));
  if (cleaned.length >= 5) parts.push(cleaned.slice(4, 8));

  return parts.join("/");
};
