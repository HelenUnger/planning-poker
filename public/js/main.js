import ChatMessage from './components/ChatMessage.js';
import openModal from './components/openModal.js';
import userControls from './components/userControls.js';

const socket = io();
// const _ = require('lodash');

window.socket = socket;

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

        activePlayers: [],

        ready: false,

        msgError: false,
        nameError: false

    },

    mounted() {
        $('#loginModal').modal('show');
    },

    computed: {
        hasDealer() {
            if(this.usersList.find(userItem => userItem.role == 1)) {
                return true;
            }
            return false;
        }
    },

    methods: {
        setUserId({sID}) {
            this.mySocketId = sID;
        },

        nicknameShare(data){
            console.log("user", data.user);
            console.log("usersList", data.usersList);
            this.notifications.push(data.user.name + " has connected!");
            this.usersList = data.usersList;
        },

        setReady(activePlayers) {
            this.activePlayers = activePlayers;
            this.ready = true;
            //filter users list to be only active players,
            //compare scores to activeUsers
            //set submitted users to submitted status, and waiting on to waiting
            //if all there, then set show to true
        },

        shareScore(score) {
            if (! this.ready) {
                return;
            }

            //filter users list to be only active players,
            //compare scores to activeUsers
            //set submitted users to submitted status, and waiting on to waiting
            //if all there, then set show to true
        },

        allScoresSubmitted() {
            this.ready = false;
        },

        appendDisconnect(data){
            console.log("append disconnect", data);
            this.usersList = data.usersList;
            this.notifications.push(data.user.name + " has disconnected!");
        }

    },

    updated: function(){
        window.scrollTo(0, document.querySelector('body').scrollHeight + 5000);
    },
}).$mount("#app");

socket.addEventListener('connected', vm.setUserId);
socket.addEventListener('setReady', vm.setReady);
socket.addEventListener('shareScore', vm.shareScore);
socket.addEventListener('nicknameShare', vm.nicknameShare);
socket.addEventListener('userDisconnect', vm.appendDisconnect);