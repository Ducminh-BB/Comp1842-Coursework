import React, {useEffect} from 'react'
import './TableFooter.css'
import {useTableFooter} from '../../../hooks/useTableFooter'

const TableFooter = ({ data, setPage, page, rows_per_page }) => {
    const {slice, range} = useTableFooter(data, page, rows_per_page)
    useEffect(() => {
        if (slice.length < 1 && page !== 1) {
          setPage(page - 1)
        }
      }, [slice, page, setPage])
      return (
        <div className='table-footer'>
          {range.map((el, index) => (
            <button
              key={index}
              className={`table-footer-btn ${
                page === el ? 'active' : 'inactive'
              }`}
              onClick={() => setPage(el)}
            >
              {el}
            </button>
          ))}
        </div>
    )
}

export default TableFooter
