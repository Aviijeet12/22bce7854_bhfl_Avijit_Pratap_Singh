import { ApiTester } from "@/components/api-tester"
import { HowItWorks } from "@/components/how-it-works"

export default function Page() {
  return (
    <div className="min-h-[100svh] flex flex-col">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold tracking-tight">BFHL API Tester</h1>
          <span className="hidden md:inline text-sm opacity-90">VIT • Full Stack</span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-white">
          <div className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
            <div className="flex flex-col gap-4">
              {/* badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-700">
                <span className="font-mono text-blue-600">POST /bfhl</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden />
                <span className="text-amber-600">200 OK</span>
              </div>
              <h2 className="text-2xl md:text-4xl text-balance">
                Test your <span className="underline decoration-amber-500 underline-offset-4">/bfhl</span> endpoint with
                confidence
              </h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Paste a JSON array payload, send the request, and see a structured response: even/odd numbers, UPPERCASE
                alphabets, special characters, sum, and the alternating-caps reverse concat string.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a href="#how-it-works" className="text-sm text-blue-700 hover:underline">
                  Learn how it works
                </a>
                <a href="#tester" className="text-sm text-blue-700 hover:underline">
                  Jump to tester
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <HowItWorks />

        {/* Tester */}
        <section id="tester" className="bg-card">
          <div className="mx-auto w-full max-w-5xl px-6 py-8 md:py-12">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6">
              <ApiTester />
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
