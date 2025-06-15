'use client'
import { Provider } from 'react-redux'
import { store } from './redux/rootRedux'
import ArtpopsHome from './components/ArtpopsHome'

export default function Home() {
  return (
    <Provider store={store}>
      <ArtpopsHome />
    </Provider>
  )
}
