import ChatMessage from './components/ChatMessage.js';
import openModal from './components/openModal.js';
import userControls from './components/userControls.js';

const socket = io();

window.socket = socket;

function setUserId({sID}) {
    vm.mySocketId = sID;
}

function appendMessage(message) {
    vm.messages.push(message);
    document.querySelector('.sound').play();
}

function nicknameShare(data){
    if (data.usersList.includes(data.user.name)) {
        console.log('already used');
    }
    console.log("user", data.user);
    console.log("usersList", data.usersList);
    vm.notifications.push(data.user.name + " has connected!");
    vm.usersList = data.usersList;
}

function appendDisconnect(data){
    console.log("append disconnect", data);
    vm.usersList = data.usersList;
    vm.notifications.push(data.user.name + " has disconnected!");
}

const vm = new Vue({
    components: {
        message: ChatMessage,
        modal: openModal,
        controls: userControls,
    },

    data: {
        mySocketId: "",
        myUser: {},
        message: "",
        messages: [],

        usersList: [],
        notifications: [],

        msgError: false,
        nameError: false

    },

    mounted() {
        $('#loginModal').modal('show');
    },

    methods: {
        addEmoji(e){
            let emoji = e.target.dataset.value;
            this.message = this.message + emoji;
        },

        dispatchMessage() {
            if(this.message != ""){
            this.msgError = false;
            // send a chat message
            socket.emit('chat message', { content: this.message, name: this.user.name} );
            this.message = "";
            }else{
                this.msgError = true;
            }
        },

        forceDisconnect(){
            socket.emit('force disconnect', { name: this.user.name } );
            window.location.replace('/loggedout');
        }

    },

    updated: function(){
        window.scrollTo(0, document.querySelector('body').scrollHeight + 5000);
    },
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('nicknameShare', nicknameShare);
socket.addEventListener('userDisconnect', appendDisconnect);