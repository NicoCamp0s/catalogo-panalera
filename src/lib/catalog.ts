export const whatsappNumber = "541161574074";
export const instagramUrl = "https://www.instagram.com/panialeranico?igsh=MTlqdWsyYmlvNnRiOQ==";
export const productsPerPage = 12;

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
