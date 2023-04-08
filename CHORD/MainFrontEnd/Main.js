//import from dom

const enterTab = document.querySelector('.ent-room-tab');
const createTab = document.querySelector('.crt-room-tab');
const enterForm = document.querySelector('.enter-room');
const createForm = document.querySelector('.create-room');
const entBtn = document.querySelector('#ent-room-sub');
const crtBtn = document.querySelector('#crt-room-sub');
const entRoom = document.querySelector('#ent-room-code');
const details = {}

enterTab.style.backgroundColor = `var(--activeTab)`;
enterForm.style.display = 'block';

//event handling
enterTab.onclick = ()=>{
    enterTab.style.backgroundColor = `var(--activeTab)`;
    enterForm.style.display = 'block';
    createTab.style.backgroundColor = `var(--tabinactive)`;
    createForm.style.display = 'none';
} 
createTab.onclick = ()=>{
    createTab.style.backgroundColor = `var(--activeTab)`;
    createForm.style.display = 'block';
    enterTab.style.backgroundColor = `var(--tabinactive)`;
    enterForm.style.display = 'none';
}
entBtn.onclick = ()=>{
    window.open(`http://localhost:${entRoom.value}`,'_parent');
}