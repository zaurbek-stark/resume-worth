'use client';

import Image from 'next/image';
import ResumeAnalyzerApp from './components/ResumeAnalyzerApp';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        <div className='logoBox'>
          <Image src="/logo.png" alt="InterviewGPT logo" width="400" height="75" />
        </div>
        <ResumeAnalyzerApp />
      </div>
    </main>
  )
}