import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold tracking-tight">
        Snippet Vault
      </h1>
      <p className="mt-4 text-muted-foreground">
        AI-Powered Code & Prompt Workspace
      </p>
    </main>
    </div>
  );
}
