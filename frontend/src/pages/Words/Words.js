import React, { useEffect, useState } from 'react'
import { useVocabsContext } from '../../hooks/useVocabContext'
import { fetchVocabs, handleDelete } from '../../handleAPI/Vocabs/vocabsAPI'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import './Words.css'
import useSearch from '../../hooks/useSearch'
import { _formatVietnameseString } from '../../formatString/_formatLang'
import TableFooter from '../../components/Footer/Table/TableFooter'
import { sliceData } from '../../hooks/useTableFooter'

const ROWS_PER_PAGE = 10

const Word = ({vocab, k}) => {

    const { dispatch } = useVocabsContext()
    const { account } = useAuthContext()

    return (
        <tr key={k}>
            <td >{vocab.english}</td>
            <td>{vocab.german}</td>
            <td>{vocab.vietnamese}</td>
            {
                account && account.role === 'admin' && (<td>
                    <div className='link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover actions'>
                        <Link to="/edit" state={{vocab}}>
                            <span>Edit</span>
                        </Link>
        
                        <span onClick={() => {
                            try 
                            {
                                handleDelete(vocab, dispatch, account.token)
                            }
                            catch (err)
                            {
                                console.error("can't delete vocab")
                            }
                        }} className='delete'>Delete</span>
                    </div>
                </td>)
            }
            
        </tr>
    )
}

const Words = () => {

    const { vocabs, dispatch } = useVocabsContext()
    const { account } = useAuthContext()
    const { search, query } = useSearch()
    

    // table footer
    const [page, setPage] = useState(1)
    const [pageQuery, setPageQuery] = useState(1)

    useEffect(() => {

        try {
            fetchVocabs(dispatch)
        }
        catch (err)
        {
            console.error("can't fatch data")
        }

    }, [dispatch])

    // filter query array
    const filterQuery = (words, query) => {
        return words.filter((v) => v.english.toLowerCase().includes(query) || v.german.toLowerCase().includes(query) || v.vietnamese.toLowerCase().includes(query) || _formatVietnameseString(v.vietnamese).toLowerCase().includes(query))
    }

    return (
        <div className='words-container'>

            <div className='wrap search'>
                <input 
                    type='text'
                    className='search-box'
                    placeholder='Search a word...'
                    onChange={(e) => search(e.target.value)}
                    value={query}
                />
            </div>
            

            <div className='data-table'>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th scope="col">English</th>
                            <th scope="col">German</th>
                            <th scope="col">Vietnamese</th>
                            {account && account.role === 'admin' && <th scope="col">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (!query)
                            ?(
                                vocabs && sliceData(vocabs, page, ROWS_PER_PAGE).map((vocab) => (
                                    <Word key={vocab._id} k={vocab._id} vocab={vocab} />
                                ))
                                
                            )
                            :(
                                vocabs && sliceData(filterQuery(vocabs, query), pageQuery, ROWS_PER_PAGE)                        
                                .map((vocab) => (
                                    <Word key={vocab._id} k={vocab._id} vocab={vocab} />
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>
            {!query && vocabs && vocabs.length > ROWS_PER_PAGE && (
                <TableFooter data={vocabs} setPage={setPage} page={page} rows_per_page={ROWS_PER_PAGE} />
            )}
            {query && vocabs && filterQuery(vocabs, query).length > ROWS_PER_PAGE && (
                <TableFooter data={filterQuery(vocabs, query)} setPage={setPageQuery} page={pageQuery} rows_per_page={ROWS_PER_PAGE} />
            )}
            {query && vocabs && filterQuery(vocabs, query).length <= 0 && (
                <div className='d-flex justify-content-center fw-bold'>
                    No vocabulary named "{query}"
                </div>
            )}
        </div>
        
        
        
    )
}

export default Words