import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Navigation() {
  return (
    <nav className="{`w-full z-50 transition-all duration-300 bg-background/80 backdrop-blur-md shadow-md ${isFixed ? 'fixed top-0' : ''}`}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold italic text-foreground">
              ASCO
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-foreground/80 transition-colors">
                Home
              </Link>
              <Link href="/app" className="text-foreground hover:text-foreground/80 transition-colors">
                App
              </Link>
              <Link href="/login" className="text-foreground hover:text-foreground/80 transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-foreground/80"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

