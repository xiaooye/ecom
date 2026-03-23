import { defineWidgetConfig } from "@medusajs/admin-sdk";

const ReviewWidget = () => {
  return (
    <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
        Product Reviews
      </h3>
      <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6b7280" }}>
        Manage product reviews from the Reviews page in the sidebar.
      </p>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ReviewWidget;
