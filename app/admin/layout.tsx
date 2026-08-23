import AdminLayout from "@/components/AdminLayout";

export const metadata = {
  title: "Admin — Afrique Solution",
  robots: "noindex, nofollow",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
