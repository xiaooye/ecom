import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with our size guide.",
};

const sizes = [
  { size: "S", chest: '34-36"', waist: '28-30"', hips: '34-36"' },
  { size: "M", chest: '38-40"', waist: '32-34"', hips: '38-40"' },
  { size: "L", chest: '42-44"', waist: '36-38"', hips: '42-44"' },
  { size: "XL", chest: '46-48"', waist: '40-42"', hips: '46-48"' },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Size Guide" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Size Guide</h1>
      <p className="mt-4 text-muted-foreground">
        Use the chart below to find your ideal fit. Measurements are in inches.
      </p>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Chest</TableHead>
            <TableHead>Waist</TableHead>
            <TableHead>Hips</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sizes.map((row) => (
            <TableRow key={row.size}>
              <TableCell className="font-medium">{row.size}</TableCell>
              <TableCell>{row.chest}</TableCell>
              <TableCell>{row.waist}</TableCell>
              <TableCell>{row.hips}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8 space-y-4 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          How to Measure
        </h2>
        <p>
          <strong>Chest:</strong> Measure around the fullest part of your chest,
          keeping the tape horizontal.
        </p>
        <p>
          <strong>Waist:</strong> Measure around your natural waistline, keeping
          the tape comfortably loose.
        </p>
        <p>
          <strong>Hips:</strong> Measure around the fullest part of your hips.
        </p>
      </div>
    </div>
  );
}
