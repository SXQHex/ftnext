// lib/constants.ts

export const CONTACT_INFO = {
    wa: "905446415745",
    phone: "+90 544 641 57 45",
    email: "info@fethiyetango.com",
    address: "Cumhuriyet Mah. No:1, Fethiye, Muğla",
    ig: "https://instagram.com/fethiyetango",
    fb: "https://facebook.com/fethiyetango",

    getWaLink(msg: string) { return `https://wa.me/${this.wa}?text=${encodeURIComponent(msg)}`},
};

export const SITE_CONFIG = {
    name: "Fethiye Tango",
    title: "Fethiye Tango Kulübü | Arjantin Tango Dersleri",
    description: "Fethiye'nin kalbinde, dünyaca ünlü maestrolar ile tango öğrenin.",
    url: "https://fethiyetango.com",
};