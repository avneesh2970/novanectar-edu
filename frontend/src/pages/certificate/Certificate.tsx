// certificate-OUC8L.tsx
"use client"

import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Certificate() {
  const navigate = useNavigate()
  const [certificateId, setCertificateId] = useState("")

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const id = certificateId.trim()
    if (!id) return
    navigate(`/certificate/${encodeURIComponent(id)}`)
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-8 mt-20">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-bold tracking-tight text-gray-900">Verify Certificate</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your Certificate ID to verify and view the details.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        aria-label="Certificate verification form"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="certificateId" className="sr-only">
          Certificate ID
        </label>

        <input
          id="certificateId"
          name="certificateId"
          type="text"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          placeholder="e.g. NN/IN/01/1000"
          aria-label="Certificate ID"
          required
          className="w-full flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
        >
          Verify
        </button>
      </form>

      <section className="mt-4">
        <p className="text-xs text-gray-600">
          Tip: The Certificate ID is shown on your issued certificate (e.g., NN/IN/01/1000).
        </p>
      </section>
    </main>
  )
}