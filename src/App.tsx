import React, { useState, useEffect } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';

type Item = {
  id: string;
  name: string;
  expiryDate: string;
  notes: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('expiryItems');
    if (savedItems) {//savedItemsが真の時
      setItems(JSON.parse(savedItems));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) { //isLoadedが真の時
      localStorage.setItem('expiryItems', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && expiryDate) {
      const newItem: Item = {
        id: Date.now().toString(),
        name,
        expiryDate,
        notes
      };
      setItems([...items, newItem]);
      setName('');
      setExpiryDate('');
      setNotes('');
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getItemStyle = (expiryDate: string) => {
    const days = differenceInDays(parseISO(expiryDate), new Date());
    if (days < 0) return 'bg-red-100';
    if (days < 7) return 'bg-yellow-100';
    return '';
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">使用期限トラッカー</h1>
      <form onSubmit={addItem} className="mb-4 p-4 bg-gray-100 rounded">
        <div className="mb-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">アイテム名</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">使用期限</label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">メモ</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          追加
        </button>
      </form>
      <ul>
        {items.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()).map(item => (
          <li key={item.id} className={`mb-2 p-2 border rounded ${getItemStyle(item.expiryDate)}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold">{item.name}</span>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">削除</button>
            </div>
            <div>使用期限: {format(parseISO(item.expiryDate), 'yyyy年MM月dd日')}</div>
            {item.notes && <div className="text-sm text-gray-600">メモ: {item.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;