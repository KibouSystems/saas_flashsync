
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Landing Page
      <Link href='/auth'>
        Get Started
      </Link>
    </div>
  );
}

