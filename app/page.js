// app/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SubmitCompanyModal from '../components/SubmitCompanyModal'

export default function Home() {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    filterCompanies()
  }, [searchTerm, selectedCategory, companies])

  async function fetchCompanies() {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setCompanies(data || [])
      setFilteredCompanies(data || [])

      // Extract unique main categories (not original_category)
      const uniqueCategories = [...new Set(data?.map(c => c.category).filter(Boolean))]
      // Sort categories alphabetically but put "Other" at the end
      const sortedCategories = uniqueCategories.sort((a, b) => {
        if (a === 'Other') return 1
        if (b === 'Other') return -1
        return a.localeCompare(b)
      })
      setCategories(sortedCategories)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterCompanies() {
    let filtered = [...companies]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.original_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.twitter_handle?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(company => company.category === selectedCategory)
    }

    setFilteredCompanies(filtered)
  }

  // Helper function to display the category
  // When "Other" is selected, show the original_category if it exists
  function displayCategory(company) {
    if (selectedCategory === 'Other' && company.category === 'Other' && company.original_category) {
      return company.original_category
    }
    return company.category || '-'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <style jsx global>{`
        .mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23004225' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .gradient-border {
          position: relative;
        }
        
        .gradient-border::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--sage-green), var(--british-racing-green), var(--sage-green));
        }

        .table-hover:hover {
          background-color: var(--forest-mist);
          transition: background-color 0.2s ease;
        }

        .search-focus:focus {
          border-color: var(--sage-green);
          box-shadow: 0 0 0 3px rgba(156, 175, 136, 0.1);
        }

        .logo-container {
          position: relative;
        }

        .logo-underline {
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--british-racing-green), var(--sage-green), var(--british-racing-green));
          margin-top: 2px;
          border-radius: 2px;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.8;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.02);
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-stack {
            flex-direction: column;
            align-items: stretch;
          }
          
          .mobile-full-width {
            width: 100%;
          }
          
          .mobile-text-center {
            text-align: center;
          }
          
          .mobile-hidden {
            display: none;
          }
        }

        @media (max-width: 640px) {
          table {
            font-size: 0.875rem;
          }
          
          th, td {
            padding: 0.75rem 0.5rem !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="gradient-border" style={{ backgroundColor: 'var(--warm-white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="logo-container">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--british-racing-green)' }}>
                  MEMPOOL.LDN
                </h1>
                <div className="logo-underline"></div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                className="px-4 py-2 text-sm font-medium tracking-wide transition-colors hover:opacity-80"
                style={{ color: 'var(--slate-gray)' }}
              >
                COMPANIES
              </button>
              <button 
                className="px-6 py-2.5 text-sm font-medium tracking-wide border-2 transition-all duration-200 rounded-md hover:shadow-lg"
                style={{ 
                  color: 'var(--british-racing-green)', 
                  borderColor: 'var(--british-racing-green)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--british-racing-green)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--british-racing-green)';
                }}
                onClick={() => setIsSubmitModalOpen(true)}
              >
                SUBMIT COMPANY
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Subtitle */}
      <div className="text-center py-12 px-4" style={{ backgroundColor: 'var(--forest-mist)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg font-medium mb-3" style={{ color: 'var(--charcoal)' }}>
            In an attempt at solving the fragmented London crypto scene - enjoy the free value.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--slate-gray)' }}>
            Idea & data by{' '}
            <a 
              href="https://x.com/_JonathanBreton" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium transition-all duration-200 underline decoration-2 hover:opacity-80 hover:decoration-4"
              style={{ 
                color: 'var(--british-racing-green)',
                textDecorationColor: 'var(--british-racing-green)'
              }}
            >
              @_JonathanBreton
            </a>
            {' '}coded by{' '}
            <a 
              href="https://x.com/willbuysdips" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium transition-all duration-200 underline decoration-2 hover:opacity-80 hover:decoration-4"
              style={{ 
                color: 'var(--british-racing-green)',
                textDecorationColor: 'var(--british-racing-green)'
              }}
            >
              @willbuysdips
            </a>
            .
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies, categories, or Twitter handles..."
              className="w-full px-6 py-4 text-lg border-2 rounded-lg search-focus transition-all duration-200 shadow-sm"
              style={{ 
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--warm-white)',
                color: 'var(--charcoal)'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className="w-5 h-5" style={{ color: 'var(--light-gray)' }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center mobile-stack">
          <div className="flex items-center space-x-3 mobile-full-width mobile-text-center">
            <span className="text-sm font-medium mobile-hidden" style={{ color: 'var(--slate-gray)' }}>Filter by:</span>
            <select
              className="px-4 py-3 border-2 rounded-lg appearance-none cursor-pointer transition-all duration-200 min-w-[200px] mobile-full-width"
              style={{ 
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--warm-white)',
                color: 'var(--charcoal)'
              }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          

        </div>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-16">
            <div 
              className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 mb-4"
              style={{ borderColor: 'var(--british-racing-green)' }}
            ></div>
            <p className="text-lg font-medium" style={{ color: 'var(--slate-gray)' }}>
              Loading companies...
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl shadow-sm border" style={{ borderColor: 'var(--border-light)' }}>
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--british-racing-green)' }}>
                  <th className="px-8 py-5 text-left text-sm font-semibold tracking-wider text-white">
                    COMPANY
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold tracking-wider text-white">
                    CATEGORY
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold tracking-wider text-white">
                    TWITTER/X
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'var(--warm-white)' }}>
                {filteredCompanies.map((company, index) => (
                  <tr 
                    key={company.id} 
                    className="table-hover border-b"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    <td className="px-8 py-6">
                      <div className="text-base font-medium" style={{ color: 'var(--charcoal)' }}>
                        {company.name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div 
                        className="text-sm px-3 py-1 rounded-full inline-block font-medium"
                        style={{ 
                          backgroundColor: 'var(--forest-mist)',
                          color: 'var(--british-racing-green-light)'
                        }}
                      >
                        {displayCategory(company)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {company.twitter_handle ? (
                        <a
                          href={company.twitter_url || `https://twitter.com/${company.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm mono font-medium transition-colors hover:underline"
                          style={{ color: 'var(--sage-green)' }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--british-racing-green)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--sage-green)'}
                        >
                          @{company.twitter_handle.replace('@', '')}
                        </a>
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--light-gray)' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-16" style={{ backgroundColor: 'var(--warm-white)' }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--forest-mist)' }}>
                  <span className="text-2xl" style={{ color: 'var(--sage-green)' }}>🔍</span>
                </div>
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--charcoal)' }}>
                  No companies found
                </p>
                <p className="text-sm" style={{ color: 'var(--slate-gray)' }}>
                  Try adjusting your search criteria or category filter
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Company Modal */}
      <SubmitCompanyModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  )
}