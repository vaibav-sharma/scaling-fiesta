// import { Button } from '@/src/components/ui/button';
import { Button } from '@/src/components/ui/button';
import LogoutButton from '@/src/components/ui/logout';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-4xl font-bold text-softwhite">Developer Showcase Lab</h1>
      <p className="text-sand max-w-lg">
        Modular playground demonstrating components and systems — API fetchers, sockets, dashboards, and more.
      </p>
     <div className="flex space-x-4">
        <Link href="/showcases">
          <Button>Explore Components</Button>
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
