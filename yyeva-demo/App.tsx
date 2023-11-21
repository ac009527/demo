import React from 'react'
import Yyeva from "./yyeva";
import jackpotAndBingo from './yyeva/jackpotAndBingo.png'
export function App() {
  return (
    <>
      <h1>Hello world!</h1>
      <Yyeva videoUrl={jackpotAndBingo}  style={{width: '300px'}}/>
    </>
  );
}

// declare module '*.mp4' {
//     const src: string;
//     export default src;
// }