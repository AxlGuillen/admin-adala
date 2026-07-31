import { Mail, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/format";

import type { Prospect } from "../queries";

/** Acciones rapidas de contacto. Vive aparte para que la tabla y el panel de
 *  detalle la compartan sin importarse entre si. */
export function ContactActions({ prospect }: { prospect: Prospect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm">
        <a
          href={whatsappUrl(prospect.phone)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle /> WhatsApp
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={`tel:+52${prospect.phone}`}>
          <Phone /> Llamar
        </a>
      </Button>
      {prospect.email ? (
        <Button asChild size="sm" variant="outline">
          <a href={`mailto:${prospect.email}`}>
            <Mail /> Email
          </a>
        </Button>
      ) : null}
    </div>
  );
}
