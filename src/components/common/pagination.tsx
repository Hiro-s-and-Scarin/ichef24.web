import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        {t('pagination.previous')}
      </Button>
      
      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={`${
                currentPage === page
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                  : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
            >
              {page}
            </Button>
          )}
        </div>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        {t('pagination.next')}
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
} 