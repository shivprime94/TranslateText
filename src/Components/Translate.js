import axios from 'axios'
import { useEffect, useState } from 'react'
import './Translate.css'
import Button from '@mui/material/Button'
import TextareaAutosize from '@mui/material/TextareaAutosize'
function Translate() {
  const [options, setOptions] = useState([])
  const [to, setTo] = useState('hi')
  const [from, setFrom] = useState('en')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const Translate = () => {
    console.log(from, input, to)
    axios
      .get(`http://localhost:5000/api?from=${from}&text=${input}&to=${to}`)
      .then((res) => {
        console.log(res.data)
        setResult(res.data.translatedText)
      })
  }

  useEffect(() => {
    axios
      .get(
        'https://libretranslate.de/languages',

        { headers: { accept: 'Translatelication/json' } }
      )
      .then((res) => {
        console.log(res.data)
        setOptions(res.data)
      })
  }, [])

  return (
    <div className='Translate'>
      <div className='translateheader'>
        <h3>From:</h3>
        <select onChange={(e) => setFrom(e.target.value)}>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
        <h3>To:</h3>
        <select onChange={(e) => setTo(e.target.value)}>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div className='text-area'>
        {/* <textarea
          name=''
          id=''
          cols='50'
          rows='20'
          onInput={(e) => setInput(e.target.value)}
        ></textarea> */}
        <TextareaAutosize
          className='boxes'
          aria-label='empty textarea'
          placeholder='Translate now'
          style={{ width: 300 }}
          minRows={15}
          onInput={(e) => setInput(e.target.value)}
        />
        <TextareaAutosize
          className='boxes'
          aria-label='empty textarea'
          placeholder='Translated text'
          style={{ width: 300 }}
          minRows={15}
          value={result}
        />
        {/* <textarea name='' id='' cols='50' rows='20' value={result}></textarea> */}
      </div>

      <Button variant='contained' onClick={Translate}>
        Translate
      </Button>
    </div>
  )
}

export default Translate
