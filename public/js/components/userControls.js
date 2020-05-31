export default {
    props: ['msg'],

    template: `
        <div class="user-controls">
            <div v-if="myRole == 1">role 1</div>
            <div v-if="myRole == 2">role 2</div>
            <div v-if="myRole == 3">role 3</div>
        </div>
    `,

    data() {
        return {
            myID: this.$parent.mySocketId,
            myRole: this.$parent.myRole,
        };
    },

    methods: {
    },
}