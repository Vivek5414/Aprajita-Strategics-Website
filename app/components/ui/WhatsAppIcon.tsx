import { MessageCircle, PhoneCall } from "lucide-react";

type WhatsAppIconProps = {
  className?: string;
};

export default function WhatsAppIcon({ className }: WhatsAppIconProps) {
  return (
    <span className={className} aria-hidden="true">
      <MessageCircle />
      <PhoneCall />
    </span>
  );
}
