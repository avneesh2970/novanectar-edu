/* eslint-disable @typescript-eslint/no-explicit-any */
// certificate-detail-CVAHP.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCertificateById, type CertificateDTO } from "./certificates";

export default function CertificateDetail() {
  const { id = "" } = useParams();
  const readableId = useMemo(() => decodeURIComponent(id), [id]);

  const [data, setData] = useState<CertificateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErrorMsg(null);

    fetchCertificateById(readableId)
      .then((doc) => {
        if (!active) return;
        setData(doc);
      })
      .catch((err: any) => {
        if (!active) return;
        setErrorMsg(err?.message || "Failed to load certificate");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [readableId]);

  const formatDate = (v?: string) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString();
  };

  const imageUrl: any =
    data?.certificateImage || data?.certificateImage?.url || "";

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-pretty text-2xl font-bold tracking-tight text-gray-900">
            Certificate Details
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Certificate ID:{" "}
            <span className="font-semibold text-gray-900">{readableId}</span>
          </p>
        </div>

        <Link
          to="/profile"
          className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          ← Verify another
        </Link>
      </header>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 grid grid-cols-[150px_1fr] gap-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 grid grid-cols-[150px_1fr] gap-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-44 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-48 w-full animate-pulse rounded border border-gray-200 bg-gray-100" />
          </div>
        </div>
      )}

      {!loading && errorMsg && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && data && (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Recipient</h2>
            <dl className="mt-4 grid grid-cols-[150px_1fr] gap-y-3">
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{data.name || "-"}</dd>

              <dt className="text-sm text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{data.type || "-"}</dd>

              <dt className="text-sm text-gray-500">Program</dt>
              <dd className="text-sm text-gray-900">
                {data.programTitle || "-"}
              </dd>

              <dt className="text-sm text-gray-500">Mode</dt>
              <dd className="text-sm text-gray-900">{data.mode || "-"}</dd>

              <dt className="text-sm text-gray-500">Company</dt>
              <dd className="text-sm text-gray-900">{data.company || "-"}</dd>

              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">{data.status || "-"}</dd>
            </dl>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Timeline</h2>
            <dl className="mt-4 grid grid-cols-[150px_1fr] gap-y-3">
              <dt className="text-sm text-gray-500">Start Date</dt>
              <dd className="text-sm text-gray-900">
                {formatDate(data.startDate)}
              </dd>

              <dt className="text-sm text-gray-500">End Date</dt>
              <dd className="text-sm text-gray-900">
                {formatDate(data.endDate)}
              </dd>

              <dt className="text-sm text-gray-500">Duration</dt>
              <dd className="text-sm text-gray-900">
                {(data.durationMonths ?? 0) > 0
                  ? `${data.durationMonths} month(s)`
                  : ""}
                {(data.durationMonths ?? 0) > 0 && (data.durationDays ?? 0) > 0
                  ? ", "
                  : ""}
                {(data.durationDays ?? 0) > 0
                  ? `${data.durationDays} day(s)`
                  : ""}
                {(data.durationMonths ?? 0) === 0 &&
                (data.durationDays ?? 0) === 0
                  ? "-"
                  : ""}
              </dd>
            </dl>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Certificate Image
            </h2>
            {imageUrl ? (
              <div className="mt-4">
                <img
                  src={
                    imageUrl ||
                    "/placeholder.svg?height=400&width=800&query=certificate%20image"
                  }
                  alt={`Certificate for ${data.name || "recipient"}`}
                  className="w-full rounded-md border border-gray-200"
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-600">No image available.</p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
