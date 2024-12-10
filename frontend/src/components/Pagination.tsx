import { Button } from './ui/button'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        variant="outline" size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="py-2 px-4 border rounded-md">
        Page {currentPage} of {totalPages}
      </span>
      <Button
       variant="ghost" size="lg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  )
}

