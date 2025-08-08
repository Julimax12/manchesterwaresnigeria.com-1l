export function Footer() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Playground Marketplace</p>
          <p className="opacity-70">Inspired by modern sports retailers. Not affiliated with Nike.</p>
        </div>
      </div>
    </footer>
  );
}