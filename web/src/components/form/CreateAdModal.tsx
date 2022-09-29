import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { Check, GameController } from "phosphor-react";
import { Input } from "./Input";
import { useEffect, useState, FormEvent } from "react";
import axios from "axios";


interface Game {
  id: string,
  title: string
}


export function CreateAdModal(){

  const [getGames, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] =  useState<string[]>([])
  const [useVoiceChanel, setUseVoiceChanel] = useState<boolean>(false)

  useEffect(() => {
    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    })
  }, [])

  async function handleCreateAd(event : FormEvent){
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    if(!data.name){
      return;
    }
    try{

      await axios.post(`http://localhost:3333/games/${data.game}/ads`,
      {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChanel
      })
      
      alert("Anúncio criado com sucesso!")
    }
    catch (err){
      console.log(err)
      alert("Erro ao criar anúncio!")
    }
  }
    return(
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed'>
              <Dialog.Content className='fixed bg-[#2A2634] px-8 py-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>

                <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

                <form className='mt-8 flex flex-col gap-4' onSubmit={handleCreateAd}>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='game' className='font-bold'>Qual o game?</label>

                    <select name="game" id="game" className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none' defaultValue="">
                      <option disabled className="text-white/50" value="">Selecione o game que deseja jogar</option>

                      {getGames.map(game => {
                        return (
                          <option key={game.id} value={game.id}>{game.title}</option>
                        )
                      })}
                    </select>
                  </div>

                  <div  className='flex flex-col gap-2'>
                    <label htmlFor='name' className='font-bold'>Seu nome (ou nickname)?</label>
                    <Input placeholder='Como te chamam dentro do game?' id="name" name="name" />
                  </div>

                  <div className='grid grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='yearsPlaying' className='font-bold'>Joga há quantos anos?</label>
                      <Input type="number" placeholder='Tudo bem ser zero' id="yearsPlaying" name="yearsPlaying"/>
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='discord' className='font-bold'>Qual o seu Discord?</label>
                      <Input placeholder='Usuario#0000' id="discord" name="discord"/>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-6'>     
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='weekDays' className='font-bold'>Quando costuma jogar?</label>
                      <ToggleGroup.Root 
                      type="multiple" 
                      className='grid grid-cols-4 gap-1'
                      value={weekDays}
                      onValueChange={setWeekDays}>
                        <ToggleGroup.Item value="0" className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Domingo'>D</ToggleGroup.Item>
                        <ToggleGroup.Item value="1" className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Segunda'>S</ToggleGroup.Item>
                        <ToggleGroup.Item value="2" className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Terça'>T</ToggleGroup.Item>
                        <ToggleGroup.Item value="3" className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Quarta'>Q</ToggleGroup.Item>
                        <ToggleGroup.Item value="4" className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Quinta'>Q</ToggleGroup.Item>
                        <ToggleGroup.Item value="5" className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Sexta'>S</ToggleGroup.Item>
                        <ToggleGroup.Item value="6" className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : ' bg-zinc-900'}`} title='Sábado'>S</ToggleGroup.Item>
                      </ToggleGroup.Root>
                    </div>

                    <div className='flex flex-col gap-2 flex-1'>
                      <label htmlFor='horario' className='font-bold'>Qual o horário do dia?</label>
                      <div className='grid grid-cols-2 gap-2'>
                        <Input type="time" placeholder='De' id="hourStart" name="hourStart" />
                        <Input type="time" placeholder='Até' id="hourEnd" name="hourEnd"/>
                      </div>
                    </div>
                  </div>

                  <label className='mt-2 flex items-center gap-2 text-sm '>
                    <Checkbox.Root className="w-6 h-6 p-1 rounded bg-zinc-900" checked={useVoiceChanel} onCheckedChange={(checked) => {
                      if(checked == true)
                        setUseVoiceChanel(true)
                      else
                        setUseVoiceChanel(false)
                    }}>
                      <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-emerald-400"/>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    Costumo me conectar ao chat de voz
                  </label>

                  <footer className='mt-4 flex justify-end gap-4'>
                    <Dialog.Close className='bg-zinc-500 hover:bg-zinc-600 px-5 h-12 rounded-md font-semibold' type='button'>Cancelar</Dialog.Close>
                    <button className='bg-violet-500 hover:bg-violet-600 px-5 h-12 rounded-md font-semibold flex items-center gap-3' type='submit'><GameController size={24}/> Encontrar o duo</button>
                  </footer>
                </form>

              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
    )
}