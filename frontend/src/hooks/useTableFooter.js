import {useState, useEffect} from 'react'

const calculateRange = (data, rowsPerPage) => {
    const range = [];
    const num = Math.ceil(data.length / rowsPerPage)
    for (let i = 1; i <= num; i++) {
      range.push(i)
    }
    return range
  }
  
export const sliceData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
}

export const useTableFooter = (data, page, rowsPerPage) => {
    const [tableRange, setTableRange] = useState([])
    const [slice, setSlice] = useState([])
  
    useEffect(() => {
      const range = calculateRange(data, rowsPerPage)
      setTableRange([...range])
  
      const slice = sliceData(data, page, rowsPerPage)
      setSlice([...slice])
    }, [data, setTableRange, page, setSlice])
  
    return { slice, range: tableRange }
}
