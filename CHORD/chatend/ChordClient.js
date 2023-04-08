// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
let receiveAudio = new Audio('msgreceive.mp3');
let Sentaudio = new Audio('notify.wav');
const userjoin = prompt('Enter your name to join the chat room');
if(userjoin){
    socket.emit('user-joined',userjoin);
}
else if(userjoin == null){
    alert('You cannot enter the room without a name');
    socket.emit('excludeuser',userjoin); 
}
else{
    alert('You cannot enter the room without a name');
    socket.emit('excludeuser',userjoin);
}
socket.on('notify',message=>{
    notice_generator(message);
})
socket.on('messagesend',message=>{
    receivemsg(message[0],message[1],message[2]);
})
socket.on('mediasend',message=>{
    receiveMedia(message[0],message[1]);
})

socket.on('room-full',message=>{
    alert(message);
    receivemsg('Chord Bot',"You are disconnected from the server. Your messages cannot be seen by other users. Try again later when the room is empty.")
    setTimeout(() => {
        socket.emit('excludeuser',userjoin);
    }, 1000);
})

const chatinput = document.querySelector('#chatinput');
const sendbtn = document.querySelector('#sendbtn');
const chatframe = document.querySelector('.chatbody');
const msgdis = document.querySelector('.dismessages');
const mrbtn = document.querySelector("#morebtn");
const optionrow = document.querySelector('.optionrow');
const sndImg = document.querySelector('.Send_Image');
const sndVid = document.querySelector('.Send_Video');
const sndDoc = document.querySelector('.Send_Document');
const sndAd = document.querySelector('.Send_Audio');
const userColor = generate_user_color();

// Fileviewer
const fileviewer = document.querySelector('.fileviewer');
const preview_Window = document.querySelector('.preview');
const closeViewer = document.querySelector("#closefileviewer");
const fileinfo = document.querySelector('.info');
const forward = document.querySelector('#forward');
let shareItem = [];
let mediatype = [];

let message_cnt = 1;
sendbtn.onclick = ()=>{
    send();
}

let send = ()=>{
    if(chatinput.value!==""){
        sendmsg(chatinput.value,userjoin);
        chatinput.value = "";
    }
}

chatinput.addEventListener('keydown',(e)=>{
    if(e.keyCode == 13){
        e.preventDefault();
        send();
    }
})


let sendmsg = (value,name)=>{
    const messagediv = document.createElement('div');
    messagediv.setAttribute('class','messages right');
    messagediv.id = 'message_'+message_cnt;
    
    const messagedom = document.createElement('div');
    messagedom.setAttribute('class','msgDom');
    const senderName = document.createElement('div');
    senderName.setAttribute('class','senderName');
    senderName.innerHTML = name;
    senderName.style.color = `${userColor}`;

    const messagecontent = document.createElement('div');
    messagecontent.setAttribute('class','messagebox');
    messagecontent.id = 'message_box_'+message_cnt;
    messagecontent.innerHTML  = value;
    
    const usericon = document.createElement('div');
    usericon.setAttribute('class','usericon');
    usericon.setAttribute('class','material-symbols-outlined');
    usericon.id = 'user_icon'+message_cnt;
    usericon.innerHTML = 'account_circle';

    msgdis.appendChild(messagediv);
    messagediv.appendChild(messagedom);
    messagedom.appendChild(senderName);
    messagedom.appendChild(messagecontent);
    messagediv.appendChild(usericon);
    message_cnt+=1; 
    socket.emit('userSentMessage',[name,value,userColor]);
    messagediv.scrollIntoView();
    Sentaudio.play()
}

let notice_generator = (value)=>{
    const noticedom = document.createElement('div');
    noticedom.innerHTML = value;
    noticedom.setAttribute('class','noticedom')
    msgdis.appendChild(noticedom);
    noticedom.scrollIntoView();
}

let receivemsg = (name,value,usercol)=>{
    const messagediv = document.createElement('div');
    messagediv.setAttribute('class','messages left');
    messagediv.id = 'message_'+message_cnt;
    
    const messagedom = document.createElement('div');
    messagedom.setAttribute('class','msgDom rec');
    const senderName = document.createElement('div');
    senderName.setAttribute('class','senderName');
    senderName.innerHTML = name;
    senderName.style.color = `${usercol}`;

    const messagecontent = document.createElement('div');
    messagecontent.setAttribute('class','messagebox');
    messagecontent.id = 'message_box_'+message_cnt;
    messagecontent.innerHTML  = value;
    
    
    const usericon = document.createElement('div');
    usericon.setAttribute('class','usericon');
    usericon.setAttribute('class','material-symbols-outlined');
    usericon.id = 'user_icon'+message_cnt;
    usericon.innerHTML = 'account_circle';

    msgdis.appendChild(messagediv);
    messagediv.appendChild(usericon);
    messagediv.appendChild(messagedom);
    messagedom.appendChild(senderName);
    messagedom.appendChild(messagecontent);
    message_cnt+=1; 
    messagediv.scrollIntoView();
    receiveAudio.play();
}

socket.on('left',name=>{
    notice_generator(`${name} has left the chat`);
})

mrbtn.onclick = ()=>{
    optionrow.classList.toggle('dis');
}
function runViewer(x,type){
    const viewer = document.createElement(`${type}`);
    viewer.style.width = "100%";
    viewer.style.height = "100%";
    
    //For Image loaders
    
    if(type == "img"){
        let imgURL = URL.createObjectURL(x);
        viewer.setAttribute('src',`${imgURL}`)
        preview_Window.appendChild(viewer);
        fileviewer.style.top = "0";
        shareItem.push(imgURL);
        mediatype.push(type);
    }

    //For Audio loaders

    if(type == "audio"){
        let audioURL = URL.createObjectURL(x);
        viewer.setAttribute('src',`${audioURL}`);
        viewer.controls = true;
        viewer.autoplay = true;
        preview_Window.appendChild(viewer);
        fileviewer.style.top = "0";
        shareItem.push(audioURL);
        mediatype.push(type);
    }

    if(type=="doc"){
        let docURL = URL.createObjectURL(x);
        viewer.innerHTML = 'NO PREVIEW AVAILABLE';
        preview_Window.appendChild(viewer);
        fileviewer.style.top = "0";
        shareItem.push(docURL);
        mediatype.push(type);
    }

    if(type == "video"){
        let videoURL = URL.createObjectURL(x);
        viewer.setAttribute('src',`${videoURL}`);
        viewer.controls = true;
        viewer.autoplay = true;
        preview_Window.appendChild(viewer);
        fileviewer.style.top = "0";
        shareItem.push(videoURL);
        mediatype.push(type);
    }
}
sndImg.onclick = ()=>{
    let mm  = document.createElement('input');
    mm.setAttribute('type','file');
    mm.setAttribute('accept','image/png, image/jpeg');
    mm.click();
    let cc = setInterval(() => {
        if(mm.value!=""){
            clearInterval(cc);
            fileinfo.innerHTML = mm.files[0].name;
            runViewer(mm.files[0],'img');
        }

    }, 100);
}
sndAd.onclick = ()=>{
    let mm  = document.createElement('input');
    mm.setAttribute('type','file');
    mm.setAttribute('accept','.wav,.mp3,.flac');
    mm.click();
    let cc = setInterval(() => {
        if(mm.value!=""){
            clearInterval(cc);
            fileinfo.innerHTML = mm.files[0].name;
            runViewer(mm.files[0],'audio');
        }

    }, 100);
}
sndDoc.onclick = ()=>{
    let mm  = document.createElement('input');
    mm.setAttribute('type','file');
    mm.click();
    let cc = setInterval(() => {
        if(mm.value!=""){
            clearInterval(cc);
            fileinfo.innerHTML = mm.files[0].name;
            runViewer(mm.files[0],'doc');
        }
    }, 100);
}
sndVid.onclick = ()=>{
    let mm  = document.createElement('input');
    mm.setAttribute('type','file');
    mm.setAttribute('accept','.mp4');
    mm.click();
    let cc = setInterval(() => {
        if(mm.value!=""){
            clearInterval(cc);
            fileinfo.innerHTML = mm.files[0].name;
            runViewer(mm.files[0],'video');
        }

    }, 100);
}

closeViewer.onclick = ()=>{
    fileviewer.style.top = "-150rem";
    preview_Window.innerHTML = "";
    shareItem = [];
    mediatype = [];
}

forward.onclick = ()=>{
    send_media(mediatype,shareItem,userjoin);
    closeViewer.click();
}

let send_media = (type,source,name)=>{
    const messagediv = document.createElement('div');
    messagediv.setAttribute('class','messages right');
    messagediv.id = 'message_'+message_cnt;
    
    const messagecontent = document.createElement(`${type}`);
    messagecontent.setAttribute('class','messagebox');
    messagecontent.id = 'message_box_'+message_cnt;
    messagecontent.src = source;
    
    if(type == 'audio' || type == 'video'){
        messagecontent.controls = true;
    }

    const usericon = document.createElement('div');
    usericon.setAttribute('class','usericon');
    usericon.setAttribute('class','material-symbols-outlined');
    usericon.id = 'user_icon'+message_cnt;
    usericon.innerHTML = 'account_circle';

    msgdis.appendChild(messagediv);
    messagediv.appendChild(messagecontent);
    messagediv.appendChild(usericon);
    message_cnt+=1; 
    socket.emit('usernameMedia',[name,type]);
    socket.emit('userMediasent', [messagecontent.src,type]);
    console.log(messagecontent.src);
    messagediv.scrollIntoView();
}

function receiveMedia(source,type){
    const messagediv = document.createElement('div');
    messagediv.setAttribute('class','messages left recmessage');
    messagediv.id = 'message_'+message_cnt;
    
    const messagecontent = document.createElement(`${type}`);
    messagecontent.setAttribute('class','messagebox');
    messagecontent.id = 'message_box_'+message_cnt;
    messagecontent.src = source;
    
    if(type == 'audio' || type == 'video'){
        messagecontent.controls = true;
    }

    const usericon = document.createElement('div');
    usericon.setAttribute('class','usericon');
    usericon.setAttribute('class','material-symbols-outlined');
    usericon.id = 'user_icon'+message_cnt;
    usericon.innerHTML = 'account_circle';

    msgdis.appendChild(messagediv);
    messagediv.appendChild(usericon);
    messagediv.appendChild(messagecontent);
    message_cnt+=1; 
    messagediv.scrollIntoView();
    receiveAudio.play();
}
function generate_user_color(){
    const color = `rgb(${Math.floor(Math.random()*225)+100},${Math.floor(Math.random()*225)+50},${Math.floor(Math.random()*225)+50})`;

    return color;
}