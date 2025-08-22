import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Landing Page
      <Link href='/signup'>
        Get Started
      </Link>
    </div>
  );
}
