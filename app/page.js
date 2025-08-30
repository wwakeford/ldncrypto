// app/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

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
      setCategories(uniqueCategories.sort())
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
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-medium tracking-tight">
                <span className="mono">⬤</span> London Crypto Directory <span className="mono text-gray-400">↓</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                COMPANIES
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                EVENTS
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                FAQ
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                SUBMIT COMPANY
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                SUBMIT EVENT
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Subtitle */}
      <div className="text-center py-8 px-4">
        <p className="text-gray-600 max-w-3xl mx-auto">
          MEMPOOL.LON aims to serve as a living directory of ongoing and emerging blockchain companies in London.
        </p>
        <p className="text-gray-600 max-w-3xl mx-auto mt-2">
          This data is a mix of public online sources, companies submitting their data here directly, and the city's offchain gossip network.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Mempool..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="w-full sm:w-64 px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 appearance-none cursor-pointer"
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

      {/* Main Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading companies...</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                    Twitter/X
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {company.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {displayCategory(company)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {company.twitter_handle ? (
                        <a
                          href={company.twitter_url || `https://twitter.com/${company.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 hover:text-gray-700 mono"
                        >
                          @{company.twitter_handle.replace('@', '')}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12 border-t border-gray-200">
                <p className="text-gray-500">No companies found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}