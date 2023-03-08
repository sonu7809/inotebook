import React, { useState } from "react";
import NoteContext from "./noteContext";


const NoteState = (props) =>{
    const notesInitial=[
        {
          "_id": "63ff01db8629fe2b9529e6f1",
          "user": "63fdade2482ffe7467e27927",
          "title": "My Title",
          "description": "Please wake up early morning",
          "tag": "personal",
          "date": "2023-03-01T07:42:19.193Z",
          "__v": 0
        },
        {
          "_id": "63ff01db8629fe2b9529e6f3",
          "user": "63fdade2482ffe7467e27927",
          "title": "My Title",
          "description": "Please wake up early morning",
          "tag": "personal",
          "date": "2023-03-01T07:42:19.825Z",
          "__v": 0
        },
        {
          "_id": "63ff01dc8629fe2b9529e6f5",
          "user": "63fdade2482ffe7467e27927",
          "title": "My Title",
          "description": "Please wake up early morning",
          "tag": "personal",
          "date": "2023-03-01T07:42:20.415Z",
          "__v": 0
        }
      ]
      const [notes, setNotes] = useState(notesInitial)
    
    return (
        <NoteContext.Provider value ={{notes , setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState