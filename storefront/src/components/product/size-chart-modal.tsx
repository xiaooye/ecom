"use client";

import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sizes = [
  { size: "S", chest: '34-36"', waist: '28-30"', hips: '34-36"', length: '27"' },
  { size: "M", chest: '38-40"', waist: '32-34"', hips: '38-40"', length: '28"' },
  { size: "L", chest: '42-44"', waist: '36-38"', hips: '42-44"', length: '29"' },
  { size: "XL", chest: '46-48"', waist: '40-42"', hips: '46-48"', length: '30"' },
];

export function SizeChartModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
          <Ruler className="mr-1 h-3 w-3" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Chest</TableHead>
              <TableHead>Waist</TableHead>
              <TableHead>Hips</TableHead>
              <TableHead>Length</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((row) => (
              <TableRow key={row.size}>
                <TableCell className="font-medium">{row.size}</TableCell>
                <TableCell>{row.chest}</TableCell>
                <TableCell>{row.waist}</TableCell>
                <TableCell>{row.hips}</TableCell>
                <TableCell>{row.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">
          All measurements are in inches. If you&apos;re between sizes, we
          recommend sizing up for a relaxed fit.
        </p>
      </DialogContent>
    </Dialog>
  );
}
