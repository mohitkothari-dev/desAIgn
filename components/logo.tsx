import Link from "next/link"
import Image from "next/image"

const Logo = () => {
  return (
    <Link href={"/dashboard"} className="relative h-10">
        <Image 
          src="/logo.png" 
          alt="logo" 
          width={100} 
          height={40}
          className="h-full w-auto object-contain"
          priority
        />
    </Link>
  )
}

export default Logo