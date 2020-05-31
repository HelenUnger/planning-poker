export default {
    template: `
        <div class="user-controls">
            <div v-if="myUser.role == undefined" class="text-center">Select Role</div>
            <div v-if="myUser.role == 1">
                <label for="ticket">Ticket:</label>
                <input v-model="ticket" type="text" class="form-control" id="ticket" placeholder="code">
                <button class="btn btn-primary" @click="readyUp">Ready Up</button>
            </div>
            <div v-if="myUser.role == 2" class="row">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-8">
                            <select v-model="score" class="form-control" id="score" required>
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
                            <button class="btn btn-primary" :disabled="! ready" @click="submitScore">Submit Score</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-right">
                    <button class="btn btn-primary" :disabled="ready" @click="setStatus">Set to Busy</button>
                </div>
            </div>
            <div v-if="myUser.role == 3">Enjoy the show!</div>
        </div>
    `,

    props: ['myUser'],

    data() {
        return {
            score: null,
            ticket: '',
            scoreError: null,
            status: this.myUser.status,
            ready: this.$parent.ready,
        };
    },

    computed: {
        activePlayers() {
            return this.$parent.usersList.filter(userItem => userItem.status == 'active' && userItem.role == 2);
        }
    },

    methods: {
        readyUp() {
            console.log("ready");
            window.socket.emit('ready', this.activePlayers);
        },

        submitScore() {
            if (! this.ready) {
                this.scoreError = 'the game hasn\'t started yet!'
                return;
            }

            if (this.score == null) {
                this.scoreError = 'select a score!'
                return;
            }

            console.log("submit!");
            window.socket.emit('submitScore', {id: this.myUser.id, score: this.score});
        },

        setStatus() {
            if (this.ready) {
                console.log("game is in progress!");
                return;
            }

            //toggle active and busy

            console.log("status");
            window.socket.emit('changeStatus', {id: this.myUser.id, status: this.status});
        },
    },
}