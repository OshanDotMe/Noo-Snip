import "@/app/globals.css";
import MainLayout from "@/components/MainLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "NooSnip",
  description: "Manage and organize your personal code snippets and prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}