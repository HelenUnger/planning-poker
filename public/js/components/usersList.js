export default {
    template: `
        <div :class="userColor">{{ user.name }}</div>
    `,

    props: ['myUser', 'inProgress', 'user'],

    computed: {
        usersList() {
            return this.$parent.usersList;
        },

        allScores() {
            return this.$parent.allScores;
        },

        activePlayers() {
            return this.$parent.activePlayers;
        },

        userColor() {
            if (this.user.status == 'busy') {
                return 'text-muted';
            } else if (this.hasSubmitted()) {
                return 'text-success';
            } else if (this.waitingSubmit()) {
                return 'text-danger';
            }
        },
    },

    methods: {
        hasSubmitted() {
            var foundUser = this.allScores.find(score => score.id == this.user.id);

            console.log(this.allScores);
            if (foundUser != undefined) {
                return true;
            }

            return false;
        },

        waitingSubmit() {
            if (this.inProgress && this.user.role == 2) {
                return true;
            }

            return false;
        }
    },
}