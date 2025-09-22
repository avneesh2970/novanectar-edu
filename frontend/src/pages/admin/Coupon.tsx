"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Coupon {
  _id: string
  code: string
  discountPercent: number
  expiry: string
  active: boolean
  createdAt: string
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    expiry: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discount`)
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  // Add new coupon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || !formData.discountPercent || !formData.expiry) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          discountPercent: Number.parseInt(formData.discountPercent),
          expiry: new Date(formData.expiry),
          active: true,
        }),
      })

      if (response.ok) {
        setFormData({ code: "", discountPercent: "", expiry: "" })
        fetchCoupons()
        alert("Coupon created successfully!")
      } else {
        const error = await response.json()
        alert(error.message || "Error creating coupon")
      }
    } catch (error) {
      console.error("Error creating coupon:", error)
      alert("Error creating coupon")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete coupon
  const handleDelete = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discount/${couponId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCoupons()
        alert("Coupon deleted successfully!")
      } else {
        alert("Error deleting coupon")
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
      alert("Error deleting coupon")
    }
  }

  // Toggle coupon active status
  const toggleActive = async (couponId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discount/${couponId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentStatus }),
      })

      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error("Error updating coupon:", error)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading coupons...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons for your internship courses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Coupon Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-600">+</span>
                Add New Coupon
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g., SAVE30"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="30"
                      min="1"
                      max="100"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Coupon"}
                </button>
              </form>
            </div>
          </div>

          {/* Coupons List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Active Coupons ({coupons.length})</h2>

              {coupons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No coupons created yet</p>
                  <p className="text-sm">Create your first coupon using the form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-bold text-lg text-blue-600">{coupon.code}</span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              coupon.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {coupon.active ? "Active" : "Inactive"}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {coupon.discountPercent}% OFF
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Expires: {new Date(coupon.expiry).toLocaleDateString()}</p>
                          <p>Created: {new Date(coupon.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(coupon._id, coupon.active)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            coupon.active
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {coupon.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
