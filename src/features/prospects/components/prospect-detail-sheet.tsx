"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDateTime, formatPhone } from "@/lib/format";

import { serviceLabel } from "../constants";
import type { Prospect } from "../queries";
import { ContactActions } from "./contact-actions";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2 text-sm">
      <dt className="text-muted-foreground col-span-1">{label}</dt>
      <dd className="col-span-2 break-words">{value ?? "—"}</dd>
    </div>
  );
}

export function ProspectDetailSheet({
  prospect,
  onOpenChange,
}: {
  prospect: Prospect | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={prospect !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {prospect ? (
          <>
            <SheetHeader>
              <SheetTitle>{prospect.full_name}</SheetTitle>
              <SheetDescription>
                Recibido el {formatDateTime(prospect.created_at)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              <ContactActions prospect={prospect} />

              <section>
                <h3 className="mb-1 text-sm font-medium">Contacto</h3>
                <Separator />
                <dl className="divide-y">
                  <Row label="Telefono" value={formatPhone(prospect.phone)} />
                  <Row label="Email" value={prospect.email} />
                  <Row label="Ciudad" value={prospect.city} />
                  <Row label="Estado" value={prospect.state_mx} />
                </dl>
              </section>

              <section>
                <h3 className="mb-1 text-sm font-medium">Solicitud</h3>
                <Separator />
                <dl className="divide-y">
                  <Row
                    label="Servicio"
                    value={
                      <Badge variant="secondary">
                        {serviceLabel(prospect.service_type)}
                      </Badge>
                    }
                  />
                  <Row label="Detalle" value={prospect.other_description} />
                </dl>
              </section>

              <section>
                <h3 className="mb-1 text-sm font-medium">Origen de campana</h3>
                <Separator />
                <dl className="divide-y">
                  <Row label="Fuente" value={prospect.utm_source} />
                  <Row label="Medio" value={prospect.utm_medium} />
                  <Row label="Campana" value={prospect.utm_campaign} />
                  <Row label="Contenido" value={prospect.utm_content} />
                  <Row label="URL de origen" value={prospect.origin_url} />
                </dl>
              </section>

              <section>
                <h3 className="mb-1 text-sm font-medium">Consentimiento</h3>
                <Separator />
                <dl className="divide-y">
                  <Row
                    label="Aviso de privacidad"
                    value={prospect.accepts_privacy ? "Aceptado" : "No aceptado"}
                  />
                  <Row
                    label="Marketing"
                    value={prospect.accepts_marketing ? "Acepta" : "No acepta"}
                  />
                  <Row
                    label="Fecha"
                    value={
                      prospect.consent_date
                        ? formatDateTime(prospect.consent_date)
                        : null
                    }
                  />
                </dl>
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
