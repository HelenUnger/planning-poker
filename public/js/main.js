import ChatMessage from './components/ChatMessage.js';
import openModal from './components/openModal.js';
import userControls from './components/userControls.js';
import usersList from './components/usersList.js';

const socket = io();
// const _ = require('lodash');

window.socket = socket;

const vm = new Vue({
    components: {
        message: ChatMessage,
        modal: openModal,
        controls: userControls,
        users: usersList,
    },

    data: {
        mySocketId: "",
        myUser: {},
        message: "",
        messages: [],

        usersList: [],
        notifications: [],
        allScores: [],

        activePlayers: [],

        waitForNewGame: false,
        inProgress: false,
        showScores: false,

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
        },

        hasPlayer() {
            if(this.usersList.find(userItem => userItem.role == 2)) {
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
            this.notifications.push(data.user.name + " has connected!");
            this.usersList = data.usersList;

            this.inProgress = data.game.inProgress;
            this.waitForNewGame = data.game.inProgress;
            this.ticketId = data.game.ticketId;
            this.allScores = data.game.allScores;
        },

        setReady(game) {
            this.ticketId = game.ticketId;
            this.inProgress = game.inProgress;
            this.activePlayers = game.activePlayers;
            this.allScores = [];
        },

        shareScore(game) {
            this.allScores = game.allScores;

            const scoreUsers = this.allScores.map(score => score.id);
            const nonSubmittedUsers = this.activePlayers.map(user => scoreUsers.includes(user.id));
            const filtered = nonSubmittedUsers.filter(answer => answer == false);

            if (filtered.length == 0) {
                this.showScores = true;
            }
        },

        resetGame() {
            this.ticketId = null;
            this.activePlayers = [];
            this.allScores = [];
            this.inProgress = false;
            this.waitForNewGame = false;
            this.$refs.controls.submittedScore = false;
        },

        appendDisconnect(data){
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
socket.addEventListener('resetGame', vm.resetGame);
socket.addEventListener('shareScore', vm.shareScore);
socket.addEventListener('nicknameShare', vm.nicknameShare);
socket.addEventListener('userDisconnect', vm.appendDisconnect);