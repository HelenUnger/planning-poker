export default {
    template: `
        <div class="user-controls">
            <div v-if="myUser.role == undefined" class="text-center">Select Role</div>
            <div v-else-if="waitForNewGame && myUser.role == 2" class="text-center">Game is in progress.. please wait</div>
            <div v-else-if="myUser.role == 1">
                <div class="row">
                    <div class="col-md-6">
                        <input v-model="ticket" type="text" class="form-control" id="ticket" placeholder="ticket ID">
                        <div v-if="readyError" class="text-danger">
                            {{ readyError }}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <button v-if="! inProgress" class="btn btn-primary" :disabled="! hasPlayer" @click="readyUp">Ready Up</button>
                        <button v-else class="btn btn-primary" @click="resetGame">Reset</button>
                    </div>
                </div>
            </div>
            <div v-else-if="myUser.role == 2" class="row">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-8">
                            <select v-model="score" :disabled="submittedScore" class="form-control" id="score" required>
                                <option :disabled="true" value="null">Select Score</option>
                                <option value="?">?</option>
                                <option value="0.5">0.5</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">5</option>
                                <option value="8">8</option>
                                <option value="13">13</option>
                                <option value="20">20</option>
                                <option value="40">40</option>
                                <option value="80">80</option>
                                <option value="100">100</option>
                                <option value="Infinity">&#8734;</option>
                            </select>
                            <div v-if="scoreError" class="text-danger">
                                {{ scoreError }}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-primary" :disabled="! inProgress || ! hasDealer || submittedScore" @click="submitScore">Submit Score</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-right">
                    <button class="btn btn-primary" :disabled="inProgress" @click="setStatus">Set to Busy</button>
                </div>
            </div>
            <div v-else-if="myUser.role == 3">Enjoy the show!</div>
        </div>
    `,

    props: ['myUser', 'inProgress'],

    data() {
        return {
            score: null,
            ticket: '',
            scoreError: null,
            readyError: null,
            status: this.myUser.status,
            submittedScore: false,
        };
    },

    computed: {
        activePlayers() {
            return this.$parent.usersList.filter(userItem => userItem.status == 'active' && userItem.role == 2);
        },

        hasDealer() {
            return this.$parent.hasDealer;
        },

        hasPlayer() {
            return this.$parent.hasPlayer;
        },

        waitForNewGame() {
            return this.$parent.waitForNewGame;
        },
    },

    methods: {
        readyUp() {
            if (this.inProgress) {
                this.readyError = 'a game is already in progress';
                return;
            }

            window.socket.emit('ready', {activePlayers: this.activePlayers, ticketId: this.ticket});
            this.ticket = '';
        },

        resetGame() {
            if (! this.inProgress) {
                this.readyError = 'no games in progress';
                return;
            }

            window.socket.emit('resetGame');
        },

        submitScore() {
            if (this.submittedScore) {
                return;
            }

            if (! this.inProgress) {
                this.scoreError = 'the game hasn\'t started yet!';
                return;
            }

            if (this.score == null) {
                this.scoreError = 'select a score!';
                return;
            }

            window.socket.emit('submitScore', {id: this.myUser.id, name: this.myUser.name, score: this.score});
            this.submittedScore = true;
        },

        setStatus() {
            if (this.inProgress) {
                console.log("game is in progress!");
                return;
            }

            //toggle active and busy

            console.log("status");
            window.socket.emit('changeStatus', {id: this.myUser.id, status: this.status});
        },
    },
}