// Entire app is wrapped in a function to avoid polluting Global Scope
(function app() 
{
    // calls LoadNotes and addItemsToList when the page is loaded
    addEventListener('load', () => 
    {
        loadNotes();
        addItemToList();
    });

    // Variables needed to persist throughout the life of the App
    const inputText = document.getElementById('inputText');
    const addButton = document.getElementById('addButton');
    const noteList = document.querySelector('ul');
    
    let notesStorage;

    // loadNotes access the users local storage, checks if 'notes' exists and if it does, takes each note and passes it into createNote
    const loadNotes = () =>
    {
        const getNotes = JSON.parse(localStorage.getItem('notes'));
        
        if(getNotes)
            getNotes.forEach(note =>  { createNote(note); });   
    }

    // This function creates a new note with text and a 'delete' button
    function createNote(text)
    {
        const note = document.createElement('li');
        const textContent = document.createTextNode(text);
        const delButton = document.createElement('button');  
                
        note.appendChild(textContent);
        note.classList.add('note');

        delButton.innerText = 'Delete';
        delButton.addEventListener('click', () => { deleteNote(delButton); });
        
        note.appendChild(delButton);
        noteList.prepend(note);
    }

    /* This callback is called when either the '+' or 'Enter' buttons are pressed, this creates a note,
       updates the notes list for toggling the class 'completed' or not and saves that note to the users local storage
    */ 
    const onNoteAdded = () =>
    {   
        if(inputText.value.length === 0)
            return;

        createNote(inputText.value);
    
        addItemToList();

        saveNotesToLocalStorage();
        inputText.value = "";
    }

    // If 'Enter' is pressed call the onNoteAdded callback
    const OnNoteAddedAfterEnter = (event) =>
    {
        if(event.code === "Enter")
            onNoteAdded(inputText.value);
    }
    
    /* If the 'delete' button inside a note is pressed, loop through the notes in the users local storage,
    once the note is found remove that note and remove the item from the list */
    const deleteNote = (btn) =>
    {
        let parent = btn.parentNode;
        const index = [...parent.parentElement.children].indexOf(parent);
        
        notesStorage.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notesStorage));
        parent.remove();
    }

    /* This function check if 'notes' exists inside local storage, if it does, fetch it, if not then create it.
       We then push the last added note into local storage and add it to the 'notes' object 
    */
    const saveNotesToLocalStorage = () =>
    {
        notesStorage = localStorage.getItem('notes') ? JSON.parse
        (localStorage.getItem('notes')) : [];

        notesStorage.push(inputText.value);
        localStorage.setItem('notes', JSON.stringify(notesStorage));
    }

    // Loop through each item in the list and add an onClick EventListener which allows the note to be marked as completed
    const addItemToList = () =>
    {
        listItems = document.querySelectorAll('li');

        listItems.forEach(function(item) 
        {        
            item.onclick = function() { item.classList.toggle('completed'); }
        });
    }

    // Add the callback functions to the input and '+' button elements
    addButton.addEventListener('click', onNoteAdded);
    inputText.addEventListener('keypress', OnNoteAddedAfterEnter);
})();