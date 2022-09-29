import { GameController, MagnifyingGlassPlus } from 'phosphor-react'
import { useEffect, useState } from 'react';
import { CreateAdBanner } from './components/CreateAdBanner';
import { GameBanner } from './components/GameBanner';
import './styles/main.css';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from './components/form/Input';
import { CreateAdModal } from './components/form/CreateAdModal';
import axios from 'axios';


function App() {

  interface Game {
    id: string,
    title: string,
    bannerUrl: string,
    _count: {
      ads: number;
    }
  }
  const [getGames, setGames] = useState<Game[]>([])


  useEffect(() => {
    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    })
  }, [])


  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
      <img src='/Logo.svg' />
      <h1 className='text-6xl text-white font-black mt-20'>Seu <span className='bg-nlw-gradient text-transparent bg-clip-text'>duo</span> está aqui!</h1>

      <div className='grid grid-cols-6 gap-6 mt-16'>
        {getGames.map(game => {
          return(
              <GameBanner 
              key={game.id}
              title={game.title}
              bannerUrl = {game.bannerUrl}
              adsCount = {game._count.ads}
              />
            )
        })}


      </div>
        <Dialog.Root>
          <CreateAdBanner />
          <CreateAdModal/>
          
        </Dialog.Root>
       
    </div>
  )
}

export default App
