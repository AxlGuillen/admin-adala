import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serviceLabel } from "@/features/prospects/constants";
import type { Prospect } from "@/features/prospects/queries";
import { formatPhone, formatRelativeDate } from "@/lib/format";

export function RecentProspects({ prospects }: { prospects: Prospect[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ultimos prospectos</CardTitle>
        <CardDescription>Los 5 registros mas recientes</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/prospectos">
              Ver todos <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {prospects.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Todavia no llega ningun prospecto.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Telefono</TableHead>
                <TableHead className="hidden md:table-cell">Ciudad</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead className="text-right">Recibido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prospects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">
                    {prospect.full_name}
                  </TableCell>
                  <TableCell className="hidden tabular-nums sm:table-cell">
                    {formatPhone(prospect.phone)}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {prospect.city}, {prospect.state_mx}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {serviceLabel(prospect.service_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-sm">
                    {formatRelativeDate(prospect.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
