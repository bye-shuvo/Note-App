const container = document.getElementById("container");
const notes = document.getElementsByClassName("notes");
const note = document.getElementById("note");
const info = document.getElementById("info");
const header = document.getElementById("header");
const add = document.getElementById("add");
const update = document.getElementById("update");
const close = document.querySelector("#btn");
const title = document.getElementById("title");
const description = document.getElementById("description");
const date = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let newnotes = document.querySelectorAll(".newNotes");
let noteButtons;
let popUps;
let editNotes = document.querySelectorAll(".edit");
let deleteNotes = document.querySelectorAll(".delete");
let popElement;
let updateEventElement;
let noteIndex;
let editNoteIndex;
let isUpdate = false;
let isDelete = false;

let noteValues = JSON.parse(localStorage.getItem("notes") || "[]");

const displayAdd = () => {
    Array.from(notes).forEach((element) => {
        element.addEventListener("click", () => {
            note.classList.add("popcloseStyle");
            note.classList.remove("popopenStyle");
            info.classList.add("popopenStyle");
            info.classList.remove("popcloseStyle");
            add.style.display = "block";
            update.style.display = "none";
            container.style.setProperty("--displaytype", "block");
            header.firstElementChild.innerText = "Add Note";
            title.value = "";
            description.value = "";
            addInfo();
        })
    }, false);
}

const displayUpdate = () => {
    isUpdate = true;
    Array.from(editNotes).forEach((element, index) => {
        element.addEventListener("click", (event) => {
            editNoteIndex = index;
            console.log(editNoteIndex);
            header.firstElementChild.innerText = "Update Note";
            updateEventElement = event.target;
            title.value = updateEventElement.parentElement.parentElement.firstElementChild.innerText;
            description.value = updateEventElement.parentElement.parentElement.nextElementSibling.innerText;
            note.classList.add("popcloseStyle");
            note.classList.remove("popopenStyle");
            info.classList.remove("popcloseStyle");
            info.classList.add("popopenStyle");
            add.style.display = "none";
            update.style.display = "block";
            container.style.setProperty("--displaytype", "block");
            updateNote();
        })
    }, false);
}
displayUpdate();


const updateNote = () => {
    update.removeEventListener("click", updateEvent);
    update.addEventListener("click", updateEvent);
}
const updateEvent = () => {
    isUpdate = true;
    note.classList.remove("popcloseStyle");
    note.classList.add("popopenStyle");
    info.classList.add("popcloseStyle");
    info.classList.remove("popopenStyle");
    noteValues.forEach((element, index) => {
        if (editNoteIndex == index) {
            getValue();
            showNote();
            closeMenu();
        }
    })
    container.style.setProperty("--displaytype", "none");
}

const getValue = () => {
    let titleValue = title.value;
    let descriptionValue = description.value;
    let noteObjs = {
        title: titleValue,
        description: descriptionValue,
        date: `${date.getDate()} ${months[date.getMonth()]},${date.getFullYear()}`
    }
    if (isUpdate == false) {
        noteValues.push(noteObjs);
    }
    else if (isDelete == true) {
        let revdelete = noteValues.toReversed();
        revdelete.splice(noteIndex, 1);
        noteValues = revdelete.toReversed();
        isDelete = false;
    }
    else {
        let revadd = noteValues.toReversed();
        revadd[editNoteIndex] = noteObjs;
        noteValues = revadd.toReversed();
        isUpdate = false;
    }
    localStorage.setItem("notes", JSON.stringify(noteValues));
}

const processDelete = () => {
    Array.from(deleteNotes).forEach((element, index) => {
        element.addEventListener("click", (event) => {
            noteIndex = index;
        })
    })
}
processDelete();

const deleteNote = () => {
    Array.from(deleteNotes).forEach((element) => {
        element.removeEventListener("click", deleteEvent);
        element.addEventListener("click", deleteEvent);
    })
}
const deleteEvent = (event) => {
    isDelete = true;
    let confirmation = confirm("Do you Want to delete this Note!!!");
    if (confirmation == true) {
        console.log(noteIndex);
        getValue();
        showNote();
        closeMenu();
        processDelete();
    }
}
deleteNote();

const popupOpen = () => {
    Array.from(noteButtons).forEach((element) => {
        element.removeEventListener("click", popOpenEvent);
        element.addEventListener("click", popOpenEvent);
    })
}
const popOpenEvent = (event) => {
    event.target.parentElement.nextElementSibling.classList.add("popopenStyle");
    event.target.parentElement.nextElementSibling.classList.remove("popcloseStyle");
    deleteNote();
    displayUpdate();
}

const popupClose = () => {
    container.removeEventListener("click", popCloseEvent);
    container.addEventListener("click", popCloseEvent);
}
const popCloseEvent = (event) => {
    Array.from(popUps).forEach((element) => {
        if (event.target != element.previousElementSibling.firstElementChild) {
            element.classList.add("popcloseStyle");
            element.classList.remove("popopenStyle");
        }
    })
}

const closeMenu = () => {
    close.addEventListener("click", () => {
        container.style.setProperty("--displaytype", "none");
        info.classList.add("popcloseStyle");
        info.classList.remove("popopenStyle");
        note.classList.add("popopenStyle");
        note.classList.remove("popcloseStyle");
    })
}
closeMenu();

const showNote = () => {
    newnotes.forEach((note) => {
        note.remove();
    });
    if (noteValues != []) {
        noteValues.forEach((Note) => {
            let newElement = `<div class="newNotes popopenStyle">
                            <div class="noteTitle">
                                <p class="noteText">${Note.title}</p>
                                <button class="noteBtns"><img src="bars-solid.svg" alt="bars">
                                </button>
                                <div class="popUp popcloseStyle">
                                     <p class="edit"><img src="pencil-solid.svg" alt="pen-theme">Edit</p>
                                    <p class="delete"><img src="trash-can-solid.svg" alt="pen-theme">Delete</p>
                                </div>
                            </div>
                            <p class="noteDescription">${Note.description}</p>
                            <p>${Note.date}</p>
                         </div>`;
            note.insertAdjacentHTML("afterend", newElement);
            newnotes = document.querySelectorAll(".newNotes");
            noteButtons = document.querySelectorAll(".noteBtns");
            popUps = document.querySelectorAll(".popUp");
            editNotes = document.querySelectorAll(".edit");
            deleteNotes = document.querySelectorAll(".delete");
            popupOpen();
            popupClose();
        })
    }
}
showNote();

const addInfo = () => {
    isUpdate = false;
    isDelete = false;
    add.removeEventListener("click", addInfoEvent);
    add.addEventListener("click", addInfoEvent);
    closeMenu();
}
const addInfoEvent = () => {
    if (title.value || description.value) {
        getValue();
        container.style.setProperty("--displaytype", "none");
        note.classList.remove("popcloseStyle");
        note.classList.add("popopenStyle");
        info.classList.add("popcloseStyle");
        info.classList.remove("popopenStyle");
        showNote();
        processDelete();
        deleteNote();
        displayUpdate();
    }
    else {
        alert("Enter Value Atleast in one section");
    }
}

displayAdd();
deleteNote();
displayUpdate();