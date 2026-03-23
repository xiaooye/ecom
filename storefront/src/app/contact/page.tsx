import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Contact Us</h1>

      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Contact form */}
        <div>
          <h2 className="text-lg font-semibold">Send us a message</h2>
          <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us more..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </div>

        {/* Contact info */}
        <div>
          <h2 className="text-lg font-semibold">Get in touch</h2>
          <div className="mt-4 space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  support@webstore.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  123 Fashion Street
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
