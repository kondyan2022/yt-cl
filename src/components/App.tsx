import { useEffect, useState } from 'react'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = BACKEND_URL
interface VideoItem {
  _id: string
  videoId: string
  channelId: string
  channelTitle: string
  title: string
  logo_url: string
  views: number
  subscribers: number
  pubDate: string
  updatedAt: string
  createdAt: string
}

function App() {
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getVideoList = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('stats', {
          params: { page: currentPage }
        })
        setVideoList(response.data.items)
        setTotalPages(response.data.totalPage)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    // setCurrentPage(response.daa.totalPage)
    getVideoList()
  }, [currentPage])

  return (
    <div className="container">
      <div className=" flex items-center justify-center gap-4 py-4">
        <button
          type="button"
          disabled={isLoading}
          className="rounded-md bg-orange-500 px-2 py-1 text-white"
          onClick={() => {
            setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
          }}
        >
          prev
        </button>
        {`Page: ${currentPage + 1} / ${totalPages} `}
        <button
          className="rounded-md bg-orange-500 px-2 py-1 text-white"
          type="button"
          disabled={isLoading}
          onClick={() => {
            setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
          }}
        >
          next
        </button>
      </div>
      <table>
        <tr>
          <th>Logo</th>
          <th className="w-[500px]">Title</th>
          <th>Channel</th>
          <th>Subscribers</th>
          <th>Views</th>
          <th>Pub date</th>
        </tr>
        {!isLoading ? (
          videoList.map(
            ({
              _id,
              logo_url,
              title,
              channelTitle,
              subscribers,
              views,
              pubDate
            }) => (
              <tr key={_id}>
                <td>
                  <img src={logo_url} />
                </td>
                <td>{title}</td>
                <td>{channelTitle}</td>
                <td className="text-center">{subscribers}</td>
                <td className="text-center">{views}</td>
                <td className="text-right">{`${new Date(
                  pubDate
                ).toLocaleDateString()} ${new Date(
                  pubDate
                ).toLocaleTimeString()}`}</td>
              </tr>
            )
          )
        ) : (
          <div>... Loading</div>
        )}
      </table>
    </div>
  )
}

export default App
