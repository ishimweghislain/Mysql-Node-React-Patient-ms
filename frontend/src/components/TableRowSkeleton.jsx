import React from 'react'

const TableRowSkeleton = ({cols = 2}) => {
  return (
    <tr>
      {Array(cols).fill(0).map((_, i) => (
        <td key={i} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  )
}

export default TableRowSkeleton
