"use client"

import { useState, useMemo, useRef } from "react"
import internship from "../assets/internship.webp"
import Footer from "../components/Footer"
import { internshipData } from "../data/courses"
import { useNavigate } from "react-router-dom"
import { ContactPopup } from "../components/contacts/ContactPopup"
import CallingIcon from "../components/socialContact/Call"
import WhatsappIcon from "../components/socialContact/Whatsapp"
import { Search, ChevronLeft, ChevronRight, X, MapPin, Phone, Filter } from "lucide-react"

export default function Internships() {
  const [hoveredCard, setHoveredCard] = useState<number | string | null>(null)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 6

  const navigate = useNavigate()

  // Ref for the internship online section
  const internshipOnlineRef = useRef<HTMLDivElement>(null)

  const handleInternshipClick = (courseId: string) => {
    navigate(`/internships/${courseId}`)
  }

  const toggleContactPopup = () => setIsContactPopupOpen(!isContactPopupOpen)

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = internshipData

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)

    // Scroll to internship online section instead of top
    setTimeout(() => {
      internshipOnlineRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setIsLoading(false)
    }, 100)
  }

  const clearFilters = () => {
    setSelectedCategory("All")
    setSearchQuery("")
    setCurrentPage(1)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 mt-28">
        {/* Enhanced Hero Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-[400px]">
            <img
              src={internship || "/placeholder.svg"}
              alt="Students collaborating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40">
              <div className="flex flex-col justify-center items-center h-full text-white text-center p-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Want to kick start your Journey</h1>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-200">You are on right track</h2>
                <p className="text-lg md:text-xl max-w-4xl leading-relaxed opacity-90">
                  At Novanectar Services Pvt. Ltd. our internship programs are designed to provide hands-on experience
                  and practical knowledge, preparing individuals for success in the professional world. We offer
                  immersive opportunities to work on real projects, guided by industry experts, to help you develop the
                  skills and expertise needed for your career growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl p-8 mb-12 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: "10,000+", label: "Enrolled Candidates", icon: "👥" },
              { number: "6,000+", label: "Certified Candidates", icon: "🎓" },
              { number: "40+", label: "Internship Domains", icon: "🚀" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <span className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</span>
                <span className="text-gray-600 font-medium text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Location Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Internship also Available in Offline Mode
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-lg mb-8">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Location:</span>
              <span>GMS Road Dehradun, Uttarakhand, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">WhatsApp:</span>
              <span>8979891703</span>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={(e) => {
                e.preventDefault()
                toggleContactPopup()
              }}
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Enhanced Internship Online Section */}
        <div ref={internshipOnlineRef} className="scroll-mt-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Internship Online</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive online internship programs designed to boost your career
            </p>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search internships by title or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Enhanced Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["All", "Technology", "Non-Technology"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg scale-105 hover:bg-blue-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  {category === "Non-Technology" ? "Non-Tech" : category}
                </button>
              ))}
            </div>

            {/* Enhanced Results Count and Clear Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-lg">
                Showing <span className="font-semibold text-blue-600">{paginatedData.length}</span> of{" "}
                <span className="font-semibold text-blue-600">{filteredData.length}</span> internships
                {searchQuery && (
                  <span className="ml-2 text-gray-500">
                    for "<span className="font-medium text-gray-700">{searchQuery}</span>"
                  </span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-6 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Internship Cards */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <div className="flex items-center gap-3 text-lg font-medium text-blue-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  Loading...
                </div>
              </div>
            )}

            {paginatedData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedData.map((domain) => (
                  <div
                    key={domain.id}
                    className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border-0 ${domain.bgColor} ${domain.hoverColor}`}
                    onMouseEnter={() => setHoveredCard(domain.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleInternshipClick(domain.id)}
                  >
                    {/* Enhanced Category Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 ${
                          domain.category === "Technology"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-purple-500 text-white hover:bg-purple-600"
                        }`}
                      >
                        {domain.category === "Non-Technology" ? "Non-Tech" : "Tech"}
                      </span>
                    </div>

                    {/* Enhanced Card Image */}
                    <div className="h-52 overflow-hidden">
                      <img
                        src={domain.image || "/placeholder.svg"}
                        alt={domain.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {domain.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">{domain.description}</p>

                      <div className="flex justify-between items-center">
                        <button
                          className={`px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 shadow-md ${
                            hoveredCard === domain.id
                              ? "bg-blue-600 hover:bg-blue-700 shadow-lg scale-105"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          Register Now
                        </button>

                        <div className="flex gap-2">
                          {domain.logos?.slice(0, 2).map((logo, index) => (
                            <div
                              key={index}
                              className="w-12 h-12 relative overflow-hidden rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                            >
                              <img
                                src={logo || "/placeholder.svg"}
                                alt={`Technology ${index + 1}`}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Hover Effect Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 ${
                        hoveredCard === domain.id ? "opacity-100" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No internships found</h3>
                <p className="text-gray-500 text-lg mb-6">We couldn't find any internships matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Beautiful Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-16 mb-8">
              {/* Page Info */}
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-lg">
                  Page <span className="font-semibold text-blue-600">{currentPage}</span> of{" "}
                  <span className="font-semibold text-blue-600">{totalPages}</span>
                </p>
              </div>

              {/* Enhanced Pagination Controls - Mobile Responsive */}
              <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-3 border border-gray-200 max-w-full overflow-x-auto">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex-shrink-0"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {getPageNumbers().map((page, index) => (
                    <div key={index} className="flex-shrink-0">
                      {page === "..." ? (
                        <span className="px-2 sm:px-3 py-1 sm:py-2 text-gray-400 font-medium text-sm sm:text-base">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page as number)}
                          className={`min-w-[36px] sm:min-w-[48px] h-9 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                            currentPage === page
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105"
                              : "border border-gray-300 hover:bg-blue-50 hover:border-blue-300 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex-shrink-0"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Quick Jump Controls - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Quick jump:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg text-xs font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactPopup isOpen={isContactPopupOpen} onClose={toggleContactPopup} />
      <Footer />
      {/* call icons */}
      <CallingIcon />
      <WhatsappIcon />
    </>
  )
}
