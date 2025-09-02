/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CertificateDTO {
  _id?: string
  certificateId: string
  type?: string // "Internship" | "Training" | etc.
  name?: string
  programTitle?: string
  mode?: string // "Online" | "Offline" | "Hybrid"
  company?: string
  durationMonths?: number
  durationDays?: number
  startDate?: string // ISO
  endDate?: string // ISO
  status?: string
  certificateImageUrl?: string // if stored as URL
  certificateImage?: { url?: string; public_id?: string } // if stored via Cloudinary object
  [key: string]: any
}

function getApiBase() {
  // Configure in your Vite env: VITE_API_URL=http://localhost:5000
  return import.meta.env.VITE_API_URL || ""
}

export async function fetchCertificateById(id: string): Promise<CertificateDTO> {
  const base = getApiBase()
  const url = `${base}/api/certificates/${encodeURIComponent(id)}`
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    // credentials: "include", // uncomment if your backend uses cookie auth
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || `Failed to fetch certificate (${res.status})`
    throw new Error(msg)
  }
  if (!data?.success) {
    throw new Error(data?.message || "Certificate not found")
  }
  return data.data as CertificateDTO
}
