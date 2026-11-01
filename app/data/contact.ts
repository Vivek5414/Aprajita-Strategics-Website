export const contactDetails = {
  companyName: "APRAJITA STRATEGICS PRIVATE LIMITED",
  contactPerson: "Ramji Prasad",
  address: [
    "Near Mata Vaishno Devi,",
    "Ratu, Ranchi, Jharkhand – 835222, India.",
  ],
  phone: "8001820834",
  displayPhone: "+91 8001820834",
  phoneHref: "tel:+918001820834",
  email: "contact@aprajitastrategies.com",
  emailHref: "mailto:contact@aprajitastrategies.com",
  whatsappHref: "https://wa.me/918001820834",
  whatsappDefaultMessage:
    "Hello, I would like to discuss a project with APRAJITA STRATEGICS.",
  businessHours: ["Monday – Friday", "9:00 AM – 6:00 PM"],
} as const;

export function getWhatsAppHref(
  message: string = contactDetails.whatsappDefaultMessage,
) {
  return `${contactDetails.whatsappHref}?text=${encodeURIComponent(message)}`;
}

export const enquiryPopupConfig = {
  firstVisitEnabled: true,
  firstVisitDelayMs: 8000,
} as const;
