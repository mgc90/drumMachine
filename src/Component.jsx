import './Component.css';
import axios from 'axios';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import 'primereact/resources/themes/mira/theme.css';  
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";


const Component = () => {

  const [data, setData] = useState([]);

  const [displayText, setDisplayText] = useState("Sound");

  const audioRef = useRef([]);

  const bankOptions = ['Bank 1', 'Bank 2'];

  const [bankValue, setBankValue] = useState(bankOptions[0]);

  const [volume, setVolume] = useState(50);

  // Below function's play's the audio
  const playAudio = useCallback((clickedButton) => {
    const audioElement = audioRef.current[clickedButton]
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play();
      setDisplayText(clickedButton);
      audioElement.volume = volume / 100;
      const buttonElement = document.getElementById(clickedButton);
     if (buttonElement) {
       buttonElement.focus();
       setTimeout(() => buttonElement.blur(), 100);
       }} 
  }, [volume]);

  const detectKeyDown = useCallback((e) => {
    const key = e.key.toUpperCase();
    data.find((elem) => ( (elem.button === key) ? playAudio(elem.id) : null)); 
  }, [data, playAudio]);
  

  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true);

    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
    };
  }, [detectKeyDown])

  useEffect(() => {
    axios(bankValue + ".json").then((res) => setData(res.data));
  
  }, [data, bankValue, detectKeyDown]);

   const padsContent = data.map((sound) => {
    return(
      <button onClick={(e) => {playAudio(sound.id)
       }} className='drum-pad' id={sound.id} key={sound.id} >
        {sound.button} <h6> ({sound.id})</h6>
        <audio ref={(el) => (audioRef.current[sound.id] = el)} 
        className='clip' id={sound.button} src={sound.src} >
        </audio>
      </button>
    )
  })

  return ( 
    <div id="drum-machine">
        <div id="display">
            <h1>Drum Machine</h1>
            <SelectButton value={bankValue} onChange={(e) => setBankValue(e.value)} options={bankOptions} className='bankSelect' />
            <div className='dbBox'>
                <h2>Volume</h2>
                <Slider value={volume} onChange={(e) => setVolume(e.value)} className="slider" />
                <InputText value={volume} onChange={(e) => setVolume(e.target.value)} className="inputText" />  
            </div>  
            <div>
            <h2>Current Sound</h2>
            <p className='currentSoundContent'>{displayText}</p>   
            </div>
                     
            {padsContent}
        </div>
    </div>
  )
}

export default Component