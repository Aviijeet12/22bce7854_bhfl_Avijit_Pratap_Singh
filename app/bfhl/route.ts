import { NextResponse } from "next/server"

type BfhlRequest = {
  data?: unknown
}

type BfhlResponse = {
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

function getUserIdentity() {
  const fullName = process.env.BFHL_FULL_NAME || "john_doe"
  const dob = process.env.BFHL_DOB_DDMMYYYY || "17091999"
  const email = process.env.BFHL_EMAIL || "your_email_here"
  const roll = process.env.BFHL_ROLL_NUMBER || "your_roll_number_here"

  const normalizedName = fullName.trim().toLowerCase().replace(/\s+/g, "_")
  return {
    user_id: `${normalizedName}_${dob}`,
    email,
    roll_number: roll,
  }
}

const ALLOW_ORIGIN = process.env.BFHL_ALLOW_ORIGIN || "*"
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      const payload: BfhlResponse = {
        is_success: false,
        ...getUserIdentity(),
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error_message: "Invalid content-type. Expected application/json.",
      }
      return NextResponse.json(payload, { status: 200, headers: CORS_HEADERS })
    }

    const body = (await req.json()) as BfhlRequest
    const arr = (body as any)?.data

    if (!Array.isArray(arr)) {
      const payload: BfhlResponse = {
        is_success: false,
        ...getUserIdentity(),
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error_message: 'Invalid body. Expected { "data": [...] }',
      }
      return NextResponse.json(payload, { status: 200, headers: CORS_HEADERS })
    }

    const even_numbers: string[] = []
    const odd_numbers: string[] = []
    const alphabets: string[] = []
    const special_characters: string[] = []
    const allAlphaCharsInOrder: string[] = []
    let sum = 0

    for (const token of arr) {
      const str = String(token)

      // Entire-token classifiers
      const isInt = /^-?\d+$/.test(str)
      const isPureAlpha = /^[A-Za-z]+$/.test(str)
      const hasNonAlnum = /[^A-Za-z0-9]/.test(str)

      // Always collect letters found anywhere for concat_string
      for (const ch of str) {
        if (/[A-Za-z]/.test(ch)) {
          allAlphaCharsInOrder.push(ch)
        }
      }

      if (isInt) {
        const num = Number.parseInt(str, 10)
        sum += num
        if (Math.abs(num) % 2 === 0) {
          even_numbers.push(str) // keep as string
        } else {
          odd_numbers.push(str) // keep as string
        }
      } else if (isPureAlpha) {
        alphabets.push(str.toUpperCase())
      } else if (hasNonAlnum) {
        // special characters = tokens containing any non-alphanumeric char(s)
        special_characters.push(str)
      } else {
        // alphanumeric-only mix (e.g., "a1") — not a number-only nor alpha-only
        // Spec doesn't require categorizing these; we simply don't include them in number/alpha/special arrays.
      }
    }

    // Build concat_string: reverse letters, alternating caps starting Upper
    const concat_string = allAlphaCharsInOrder
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("")

    const identity = getUserIdentity()
    const response: BfhlResponse = {
      is_success: true,
      ...identity,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string,
    }

    return NextResponse.json(response, { status: 200, headers: CORS_HEADERS })
  } catch (error) {
    const identity = getUserIdentity()
    const payload: BfhlResponse = {
      is_success: false,
      ...identity,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error_message: "Unexpected error processing request.",
    }
    return NextResponse.json(payload, { status: 200, headers: CORS_HEADERS })
  }
}
