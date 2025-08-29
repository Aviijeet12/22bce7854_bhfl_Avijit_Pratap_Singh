import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-slate-900">
          BFHL Evaluator<span className="sr-only"> Home</span>
        </Link>
        <nav className="flex items-center gap-2">
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">
            How it works
          </a>
          <a href="#tester">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">Open Tester</Button>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
