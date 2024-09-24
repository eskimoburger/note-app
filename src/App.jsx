/* eslint-disable react/prop-types */
import "@picocss/pico";
import "./App.css";
import {
  useCallback,
  useEffect,
  useState,
  // useRef,
} from "react";

// function useDebounceFn(fn, delay = 1000) {
//   const timeout = useRef(null);

//   return (...arg) => {
//     clearTimeout(timeout.current);
//     timeout.current = setTimeout(() => {
//       fn(...arg);
//     }, delay);
//   };
// }
function useDebounceValue(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}

function NoteWidget({ note, editing, onEditNote, onDeleteNote }) {
  return (
    <article
      key={note.id}
      className={`note-item ${editing ? "note-editing" : ""}`}
    >
      {note.image && (
        <img
          src={note.image}
          alt="Note"
          style={{
            width: 24,
          }}
        />
      )}

      <div className="note-title">{note.title}</div>
      <button
        className="note-edit-button"
        onClick={() => {
          onEditNote?.();
        }}
      >
        ✍️
      </button>
      <button
        className="note-delete-button"
        onClick={() => {
          onDeleteNote?.();
        }}
      >
        🗑️
      </button>
    </article>
  );
}

function App() {
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [noteData, setNoteData] = useState(null);
  const [notes, setNotes] = useState(() =>
    localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : []
  );
  const [deletingItem, setDeletingItem] = useState(null);
  const debounceNotes = useDebounceValue(notes, 1000);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(debounceNotes));
  }, [debounceNotes]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "notes") {
        setNotes(JSON.parse(event.newValue) ?? []);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const saveNote = useCallback(
    (newData) => {
      const isExisted = notes.find((note) => note.id === newData.id);

      if (isExisted) {
        setNotes(
          notes.map((note) => (note.id === newData.id ? newData : note))
        );
      } else {
        setNotes([...notes, newData]);
      }
    },
    [notes]
  );

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (event.shiftKey) {
          // redo
          const lastNote = future[0];
          if (lastNote) {
            setNoteData(lastNote);
            setFuture(future.slice(1));
            saveNote(lastNote);
            setHistory([noteData, ...history]);
          }
        } else {
          // undo
          const previousNote = history[0];
          if (previousNote) {
            setNoteData(previousNote);
            setHistory(history.slice(1));
            saveNote(previousNote);
            setFuture([noteData, ...future]);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [future, history, noteData, saveNote]);

  /**
   *  Update the noteData object with the new value
   * @param {string} field - The field to update
   * @param {string} value - The new value
   * @returns {
   * void
   * }
   *
   * @example
   * updateField('title', 'New Title')
   * // Will update the title of the noteData object
   *
   */
  const updateField = (field, value) => {
    if (noteData.id) {
      const newData = {
        ...noteData,
        [field]: value,
      };
      saveNote(newData);
      setNoteData(newData);
      setHistory([noteData, ...history]);
    } else {
      const newId = Date.now();
      const newData = {
        ...noteData,
        [field]: value,
        id: newId,
      };

      saveNote(newData);
      setNoteData(newData);
      setHistory([noteData, ...history]);
    }
  };

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Note App</h1>
        <button
          onClick={() => {
            setNoteData({ title: "", content: "" });
          }}
        >
          ✍️
        </button>
      </div>

      {notes.length > 0 ? (
        <div className="note-list">
          {notes.map((note) => {
            return (
              <NoteWidget
                key={note.id}
                note={note}
                editing={note.id === noteData?.id}
                onEditNote={() => {
                  setNoteData(note);
                }}
                onDeleteNote={() => {
                  setDeletingItem(note);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="empty-notes">No notes available</div>
      )}

      {deletingItem && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-title">
              Are you sure you want to delete this note?
            </div>
            <p>
              to delete the note with the title: <b>{deletingItem.title}</b>
            </p>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setNotes(notes.filter((n) => n.id !== deletingItem.id));
                  setDeletingItem(null);
                }}
              >
                Yes
              </button>
              <button onClick={() => setDeletingItem(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      <br />

      {noteData && (
        <>
          <label htmlFor="note-title">
            Title <br />
            <input
              value={noteData.title}
              type="text"
              id="note-title"
              placeholder="The notes's title"
              onChange={(e) => {
                updateField("title", e.target.value);
              }}
              required
            />
          </label>

          <label htmlFor="note-content">
            Content <br />
            <textarea
              value={noteData.content}
              type="text"
              id="note-content"
              placeholder="The content"
              required
              onChange={(e) => {
                updateField("content", e.target.value);
              }}
            />
          </label>

          <label>
            Image <br />
            {noteData.image && (
              <img
                src={noteData.image}
                alt="Note"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                }}
              />
            )}
            <input
              type="file"
              onChange={(e) => {
                if (!e.target.files.length) return;
                const file = e.target.files[0];
                updateField("image", URL.createObjectURL(file));
              }}
            />
          </label>
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            <button
              disabled={history.length === 0}
              onClick={() => {
                const previousNote = history[0];
                if (previousNote) {
                  setNoteData(previousNote);
                  setHistory(history.slice(1));
                  saveNote(previousNote);
                  setFuture([noteData, ...future]);
                }
              }}
            >
              Undo
            </button>
            <button
              disabled={future.length === 0}
              onClick={() => {
                const lastNote = future[0];
                if (lastNote) {
                  setNoteData(lastNote);
                  setFuture(future.slice(1));
                  saveNote(lastNote);
                  setHistory([noteData, ...history]);
                }
              }}
            >
              Redo
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
