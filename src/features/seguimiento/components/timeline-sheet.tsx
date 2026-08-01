"use client";

import { useActionState } from "react";
import { useQueryState } from "nuqs";
import { ArrowRight, MessageCircle, MessageSquareText, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { serviceLabel } from "@/features/prospects/constants";
import { formatDateTime, formatRelativeDate, whatsappUrl } from "@/lib/format";

import { addNote, type NoteState } from "../actions";
import { statusLabel } from "../constants";
import type { Timeline, TimelineEntry } from "../queries";

const initialNoteState: NoteState = { error: null, ok: false };

function Entry({ entry }: { entry: TimelineEntry }) {
  return (
    <li className="flex gap-2.5">
      <span className="bg-[var(--secondary)] text-muted-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
        {entry.kind === "nota" ? (
          <MessageSquareText className="size-3" />
        ) : (
          <ArrowRight className="size-3" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        {entry.kind === "nota" ? (
          <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">
            {entry.body}
          </p>
        ) : (
          <p className="text-[13px]">
            <span className="text-muted-foreground">
              {statusLabel(entry.from_status ?? "nuevo")}
            </span>{" "}
            → <span className="font-medium">{statusLabel(entry.to_status ?? "")}</span>
          </p>
        )}
        <p
          className="text-faint mt-0.5 text-[11px]"
          title={formatDateTime(entry.created_at)}
        >
          {entry.author_email} · {formatRelativeDate(entry.created_at)}
        </p>
      </div>
    </li>
  );
}

export function TimelineSheet({ timeline }: { timeline: Timeline | null }) {
  const [, setProspecto] = useQueryState("prospecto", { shallow: false });
  const [state, formAction, isPending] = useActionState(
    addNote,
    initialNoteState,
  );

  const prospect = timeline?.prospect;

  return (
    <Sheet
      open={timeline !== null}
      onOpenChange={(open) => {
        if (!open) void setProspecto(null);
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {timeline && prospect ? (
          <>
            <SheetHeader>
              <SheetTitle>{prospect.full_name}</SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex h-5 items-center rounded-full bg-[var(--secondary)] px-2 text-[10.5px] font-medium text-[var(--secondary-foreground)]">
                  {statusLabel(timeline.estado ?? "nuevo")}
                </span>
                <span className="inline-flex h-5 items-center rounded-full bg-[var(--secondary)] px-2 text-[10.5px] font-medium text-[var(--secondary-foreground)]">
                  {serviceLabel(prospect.service_type)}
                </span>
                <span>
                  {prospect.city}, {prospect.state_mx}
                </span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-4 pb-8">
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
              </div>

              {/* La key remonta el form (textarea limpia) cuando entra la nota. */}
              <form
                key={timeline.entries.length}
                action={formAction}
                className="flex flex-col gap-2"
              >
                <input type="hidden" name="prospectId" value={prospect.id} />
                <Textarea
                  name="body"
                  required
                  maxLength={2000}
                  placeholder="Escribe una nota del seguimiento…"
                  className="min-h-20 bg-[var(--glass-field)] text-[13px]"
                />
                {state.error ? (
                  <p role="alert" className="text-destructive text-xs">
                    {state.error}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="adala-accent self-end border-0"
                >
                  {isPending ? <Spinner className="size-3.5" /> : null}
                  Guardar nota
                </Button>
              </form>

              <div>
                <p className="adala-eyebrow text-muted-foreground mb-3">
                  Historial
                </p>
                {timeline.entries.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Sin actividad todavia. Recibido el{" "}
                    {formatDateTime(prospect.created_at)}.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3.5">
                    {timeline.entries.map((entry) => (
                      <Entry key={entry.id} entry={entry} />
                    ))}
                    <li className="text-faint pl-[34px] text-[11px]">
                      Recibido el {formatDateTime(prospect.created_at)}
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
