'use client';
import { useState } from 'react';
import * as React from "react";

function Page() {
  const [results, setResults] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [operations, setOperations] = useState([]);
  const [inputExpression, setInputExpression] = useState('');
  const [inputOperation, setInputOperation] = useState('');

  async function postData(operation, expression) {
    const res = await fetch('/prueba/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation, expression }),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await postData(inputOperation, inputExpression);
      setResults(prevResults => [...prevResults, data.result]);
      setExpressions(prevExpressions => [...prevExpressions, inputExpression]);
      setOperations(prevOperations => [...prevOperations, inputOperation]);
      setInputExpression('');
      setInputOperation('');
    } catch (error) {
      console.error('Error submitting expression:', error);
    }
  };

  const handleRemove = (index) => {
    setResults(prevResults => prevResults.filter((_, i) => i !== index));
    setExpressions(prevExpressions => prevExpressions.filter((_, i) => i !== index));
    setOperations(prevOperations => prevOperations.filter((_, i) => i !== index));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputOperation}
            placeholder="Operation"
            onChange={(e) => setInputOperation(e.target.value)}
            required
          />
          <input
            type="text"
            value={inputExpression}
            placeholder="Expression"
            onChange={(e) => setInputExpression(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-500 text-white px-2 py-1">Add Expression</button>
        </form>

        <table className="min-w-full border border-gray-500 mt-4">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="px-4 py-2 border-r border-gray-500">Operation</th>
              <th className="px-4 py-2 border-r border-gray-500">Expression</th>
              <th className="px-4 py-2 border-r border-gray-500">Result</th>
              <th className="px-4 py-2 border-r border-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-b border-gray-500">
                <td className="px-4 py-2 border-r border-gray-500">{operations[index]}</td>
                <td className="px-4 py-2 border-r border-gray-500">{expressions[index]}</td>
                <td className="px-4 py-2 border-r border-gray-500">{result}</td>
                <td className="px-4 py-2 border-r border-gray-500">
                  <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleRemove(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Page;
