'use client';

import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Отправка запроса...');
    
    try {
      const response = await fetch('/api/generate-complex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Тест',
          age: '30',
          diagnoses: ['stroke'],
          symptoms: ['weakness'],
          time: '1-3',
          format: 'self',
          contact: 'test@example.com',
          email: 'test@example.com',
        }),
      });

      const data = await response.json();
      
      setResult(`Status: ${response.status}\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Тест API генерации</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Загрузка...' : 'Запустить тест'}
      </button>
      
      <pre className="mt-8 p-4 bg-gray-100 rounded whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
}
