import { Breadcrumbs } from "@/components/shared/breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}

/**
 * Consistent page header with breadcrumbs, title, and optional description.
 */
export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
