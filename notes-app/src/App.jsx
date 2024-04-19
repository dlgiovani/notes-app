import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import "./index.css"

export default function App() {
    const [notes, setNotes] = useState(() => 
      JSON.parse(localStorage.getItem("storedNotes")) || []
)
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    )

    useEffect(() => {
      localStorage.setItem("storedNotes", JSON.stringify(notes));
    }, [notes]
    );

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    function deleteNote(event, noteId) {
      event.stopPropagation();
      console.log(JSON.stringify(notes));
      setNotes(oldNotes => oldNotes.filter((note) => note.id !== noteId) );
      console.log(JSON.stringify(notes));
    }
    
    function updateNote(text) {
      var newNotes = [];
        setNotes(oldNotes => {
            for (let i = 0; i < oldNotes.length; i++) {
              if (oldNotes[i].id === currentNoteId) {
                let thisNote = {...oldNotes[i]};
                thisNote.body = text;
                oldNotes.splice(i, 1);
                newNotes = [thisNote, ...oldNotes];
                break;
              } 
            }
            return newNotes.length === 0 ? oldNotes : newNotes;
        })
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
