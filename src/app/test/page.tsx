'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [data, setData] = useState<string>('');
  
  console.log('TestPage component rendered');
  
  useEffect(() => {
    console.log('TestPage useEffect executed!');
    setData('useEffect worked!');
  }, []);
  
  return (
    <div className="p-4">
      <h1>Test Page</h1>
      <p>Data: {data}</p>
    </div>
  );
}