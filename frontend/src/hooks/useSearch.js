import { useState } from 'react'

function useSearch() {

    const [query, setQuery] = useState('')

    const search = (q) => {
        setQuery(q)
    }

    return { search, query }
}

export default useSearch
