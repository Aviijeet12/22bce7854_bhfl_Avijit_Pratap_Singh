"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type ApiResponse = {
  is_success: boolean
  user_id: string
  email: string
  roll_number: string
  odd_numbers: string[]
  even_numbers: string[]
  alphabets: string[]
  special_characters: string[]
  sum: string
  concat_string: string
  error_message?: string
}

const EXAMPLE_A = {
  data: ["a", "1", "334", "4", "R", "$"],
}
const EXAMPLE_B = {
  data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"],
}
const EXAMPLE_C = {
  data: ["A", "ABcD", "DOE"],
}

export function ApiTester() {
  const [apiBase, setApiBase] = React.useState<string>("")
  const [input, setInput] = React.useState<string>(JSON.stringify(EXAMPLE_A, null, 2))
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<ApiResponse | null>(null)

  const base = React.useMemo(() => apiBase.trim().replace(/\/+$/, ""), [apiBase])
  const endpoint = `${base || ""}/bfhl`

  function loadExample(example: unknown) {
    setInput(JSON.stringify(example, null, 2))
    setResult(null)
    setError(null)
  }

  function formatJson() {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
    } catch {
      setError("Cannot format: input is not valid JSON.")
    }
  }

  function clearAll() {
    setInput('{\n  "data": []\n}')
    setResult(null)
    setError(null)
  }

  async function copyResponse() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    } catch {
      // no-op
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    let body: any
    try {
      body = JSON.parse(input)
    } catch {
      setLoading(false)
      setError('Invalid JSON. Please provide a valid JSON body like { "data": ["1","a"] }.')
      return
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as ApiResponse
      setResult(json)
    } catch {
      setError("Failed to call the API. Check your API URL and network.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-balance">BFHL API Tester</CardTitle>
        <CardDescription>
          Paste a JSON body, set your API base (optional), and call <span className="font-mono">POST /bfhl</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* API base and endpoint helper */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="apiBase">API Base URL (optional)</Label>
              <Input
                id="apiBase"
                placeholder="https://your-api-host.com"
                value={apiBase}
                onChange={(e) => setApiBase(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Endpoint used: <span className="font-mono text-primary">{endpoint}</span>
              </p>
            </div>

            {/* Samples toolbar */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-1">Samples:</span>
              <Button
                type="button"
                variant="secondary"
                className="h-8 px-3"
                onClick={() => loadExample(EXAMPLE_A)}
                aria-label="Load Example A"
              >
                Example A
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-8 px-3"
                onClick={() => loadExample(EXAMPLE_B)}
                aria-label="Load Example B"
              >
                Example B
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-8 px-3"
                onClick={() => loadExample(EXAMPLE_C)}
                aria-label="Load Example C"
              >
                Example C
              </Button>
              <div className="mx-2 h-6 w-px bg-border" aria-hidden />
              <Button type="button" variant="ghost" className="h-8 px-3" onClick={formatJson}>
                Format JSON
              </Button>
              <Button type="button" variant="ghost" className="h-8 px-3" onClick={clearAll}>
                Clear
              </Button>
            </div>

            {/* Request body */}
            <div className="grid gap-2">
              <Label htmlFor="input">Request Body</Label>
              <Textarea
                id="input"
                className="min-h-40 font-mono text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"data": ["1","a"]}'
              />
              <p className="text-xs text-muted-foreground">
                Provide an object with a "data" array. Numbers must be strings in the response per the spec.
              </p>
            </div>
          </div>

          {/* Submit + errors */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Send POST /bfhl"}
            </Button>
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        </form>

        {/* Response */}
        <div className="grid gap-3">
          <Label>Response</Label>
          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-md border bg-muted/50 px-3 py-2">
            <span
              className={cn(
                "inline-flex h-2.5 w-2.5 rounded-full",
                result?.is_success ? "bg-primary" : result ? "bg-destructive" : "bg-border",
              )}
              aria-hidden
            />
            <span className="text-sm">
              {result ? (result.is_success ? "Success" : "Failure") : "Waiting for response..."}
            </span>
            {result?.error_message && <span className="text-sm text-destructive">• {result.error_message}</span>}
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="ghost" className="h-8 px-3" onClick={copyResponse} disabled={!result}>
                Copy JSON
              </Button>
            </div>
          </div>

          {/* Summary cards */}
          {result && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-md border bg-card p-3">
                <div className="text-xs text-muted-foreground">Sum</div>
                <div className="font-semibold">{result.sum}</div>
              </div>
              <div className="rounded-md border bg-card p-3">
                <div className="text-xs text-muted-foreground">Even</div>
                <div className="font-semibold">{result.even_numbers.length}</div>
              </div>
              <div className="rounded-md border bg-card p-3">
                <div className="text-xs text-muted-foreground">Odd</div>
                <div className="font-semibold">{result.odd_numbers.length}</div>
              </div>
              <div className="rounded-md border bg-card p-3">
                <div className="text-xs text-muted-foreground">Alphabets</div>
                <div className="font-semibold">{result.alphabets.length}</div>
              </div>
              <div className="rounded-md border bg-card p-3">
                <div className="text-xs text-muted-foreground">Special</div>
                <div className="font-semibold">{result.special_characters.length}</div>
              </div>
              <div className="rounded-md border bg-card p-3 col-span-2 md:col-span-1">
                <div className="text-xs text-muted-foreground">Concat</div>
                <div className="font-mono text-sm break-all">{result.concat_string || "—"}</div>
              </div>
            </div>
          )}

          {/* Pretty JSON */}
          <pre className={cn("min-h-28 rounded-md bg-muted p-4 text-sm overflow-auto", "font-mono")}>
            {result ? JSON.stringify(result, null, 2) : "// Response will appear here"}
          </pre>

          {/* Category chips */}
          {result && (
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Even Numbers</div>
                <div className="flex flex-wrap gap-2">
                  {result.even_numbers.length ? (
                    result.even_numbers.map((n, i) => (
                      <span
                        key={`even-${i}`}
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      >
                        {n}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Odd Numbers</div>
                <div className="flex flex-wrap gap-2">
                  {result.odd_numbers.length ? (
                    result.odd_numbers.map((n, i) => (
                      <span
                        key={`odd-${i}`}
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      >
                        {n}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Alphabets (UPPERCASE)</div>
                <div className="flex flex-wrap gap-2">
                  {result.alphabets.length ? (
                    result.alphabets.map((a, i) => (
                      <span
                        key={`alpha-${i}`}
                        className="inline-flex items-center rounded-md bg-card border px-2 py-1 text-xs"
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Special Characters</div>
                <div className="flex flex-wrap gap-2">
                  {result.special_characters.length ? (
                    result.special_characters.map((s, i) => (
                      <span
                        key={`special-${i}`}
                        className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
