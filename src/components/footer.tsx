import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t pt-6 text-center text-muted-foreground text-sm">
      <p>&copy; 2024 EdTech AI Hub. All rights reserved.</p>
      <div className="flex justify-center items-center gap-4 mt-2">
        <Link href="#" className="hover:text-primary transition-colors">
          Privacy Policy
        </Link>
        <span className="text-muted-foreground/50">|</span>
        <Link href="#" className="hover:text-primary transition-colors">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
