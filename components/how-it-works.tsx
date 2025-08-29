import { CheckCircle2, Upload, Eye } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "1. Provide input",
    desc: 'Paste or craft JSON with a data array, e.g. { "data": ["a","1","$"] }.',
  },
  {
    icon: CheckCircle2,
    title: "2. Send request",
    desc: "Click Send to POST your payload to the /bfhl API and receive a 200 response.",
  },
  {
    icon: Eye,
    title: "3. Review result",
    desc: "See even/odd/alphabet/special arrays, sum as a string, and the reversed alternating-caps letters.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <h2
          id="how-it-works-title"
          className="text-pretty text-2xl md:text-3xl font-semibold tracking-tight text-slate-900"
        >
          How it works
        </h2>
        <p className="mt-2 max-w-3xl text-pretty text-slate-600">
          This API parses your input array, separates numbers and alphabets, detects special characters, returns the sum
          (as a string), and produces a reversed, alternating-caps concatenation of all letters found.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-600" aria-hidden />
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
