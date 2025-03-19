import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isBot: boolean}>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setIsLoading(true);
      const userMessage = inputText;
      setInputText('');
      setMessages(prev => [...prev, { text: userMessage, isBot: false }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.message) {
        throw new Error('No response data');
      }

      setMessages(prev => [...prev, { text: data.message, isBot: true }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl">
          <div className="p-4 bg-green-500 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-600 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`mb-3 flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isBot 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'bg-green-500 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-500">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Type a message..."
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}