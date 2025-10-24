import './App.css'
import {useEffect, useRef, useState} from "react";

const API_URL = '/api/fe/wordle-words';

function App() {
  const [word, setWord] = useState<string>("")

  const fetchData = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const words = await response.json()

    const randomNumber = Math.floor(Math.random() * words.length);
    setWord(words[randomNumber]);
  }

  useEffect(() => {
        fetchData()
      }, []
  )

  return (
      <>
        <div className="flex flex-col items-center justify-center">
          {[...Array(5)].map((_, i) => (
              <RowElement key={i} word={word}/>
          ))}
        </div>
      </>
  )
}

const RowElement = ({word}: any) => {
  const [wordArray, setWordArray] = useState<string[]>(Array(5).fill(""));
  const [disabled, setDisabled] = useState<boolean>(false);

  function handleChange(value: string, index: number) {
    value = value.toUpperCase();

    setWordArray((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    })
  }

  useEffect(() => {
    if (wordArray.every((char) => char !== "")) {
      setDisabled(true);
      checkWord();
    }
  }, [wordArray]);

  function checkWord() {
    const newColors = wordArray.map((char, i) => {
      if (char === word[i]) {
        return Colors.green;
      }
      if (word.includes(char)) {
        return Colors.yellow;
      }
      return Colors.gray;
    });

    setBgColors(newColors);
  }

  console.log(word);

  const [bgColors, setBgColors] = useState<string[]>(Array(5).fill(Colors.gray))

  return (
      <>
        <div className="flex flex-row">
          {wordArray.map((_, index) => (
              <CharElement bgColor={bgColors[index]} handleChange={handleChange} index={index} disabled={disabled}/>
          ))}
        </div>
      </>
  );
}

const CharElement = ({bgColor, handleChange, index, disabled = false}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
      <input
          ref={inputRef}
          onChange={(event) => {
            handleChange(event.target.value, index);
            if (event.target.value && inputRef.current?.nextElementSibling instanceof HTMLInputElement) {
              inputRef.current.nextElementSibling.focus();
            }
          }}
          maxLength={1}
          disabled={disabled}
          className={`border text-black font-semibold border-black p-2 w-[75px] h-[75px] text-[25px] text-center ${bgColor}`}>
      </input>
  );
}

const Colors = {
  gray: "bg-gray-500/10",
  green: "bg-green-500/20",
  yellow: "bg-yellow-500/20"
}

export default App
