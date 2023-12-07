import { useState, useEffect } from 'react'

const InitialLoadComponent = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState({ content: '' })

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:7070/notes');
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };

    fetchNotes();
  }, []);

  const handleDeleteNote = async (id: number) => {
    try {
      await fetch(`http://localhost:7070/notes/${id}`, {
        method: 'DELETE',
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  };

  const handleAddNote = async () => {
    try {

      const response = await fetch('http://localhost:7070/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      // Проверяем, является ли ответ JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not respond with JSON data');
      }

      const data = await response.json();

      setNotes(data);
      setNewNote({ content: '' });
    } catch (error) {
      console.error('Error adding note:', error.message);
    }
  };

  return (
    <div>
      <h2>Заметки</h2>

      <div>
        <label>
          Содержание:
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
        </label>
        <button onClick={handleAddNote}>Сохранить</button>
      </div>

      {notes.map((note) => (
        <div key={note.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p>{note.content}</p>
          <button onClick={() => handleDeleteNote(note.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default InitialLoadComponent;
