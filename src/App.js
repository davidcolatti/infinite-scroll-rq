import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import './App.css'

const PER_PAGE_COUNT = 30

const fetchRepositories = async (page = 1) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=topic:reactjs&per_page=${PER_PAGE_COUNT}&page=${page}`)
  return response.json()
}

const App = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    'repositories',
    ({ pageParam }) => fetchRepositories(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = lastPage.total_count / PER_PAGE_COUNT // total_count key comes from api being used
        const nextPage = allPages.length + 1
        return nextPage <= maxPages ? nextPage : undefined
      }
    }
  )

  useEffect(() => {
    // let fetching = false
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } = event.target.scrollingElement

      // toward the bottom
      if (!isFetchingNextPage && scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (hasNextPage) {
          await fetchNextPage()
        }
      }
    }

    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  return (
    <ul className='list'>
      {data.pages?.map(page =>
        page.items.map(repo => {
          return <li key={repo.id}>{repo.name}: {repo.description}</li>
        })
      )}
      {isFetchingNextPage && <li>Loading More Repos...</li>}
    </ul>
  );
};

export default App;