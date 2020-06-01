export default {
    props: ['msg'],

    template: `
    <div class="modal fade" id="loginModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <form v-if="needCode" class="m-3">
                        <label for="name">Room Code:</label>
                        <input v-model="user.roomCode" type="text" class="form-control" id="roomCode">
                        <div v-if="codeError" class="text-danger">
                            {{ codeError }}
                        </div>
                        <div class="text-right">
                        <button class="btn btn-primary mt-3" type="submit" @click.prevent="setRoomCode">
                            Next
                        </button>
                        </div>
                    </form>
                    <form v-else class="m-3">
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input v-model="user.name" type="text" class="form-control" id="name">
                            <div v-if="nameError" class="text-danger">
                                {{ nameError }}
                            </div>
                            <div class="form-group mt-3">
                                <label for="role">Role</label>
                                <select v-model.number="user.role" class="form-control" id="role" required>
                                <option value="1">dealer</option>
                                <option value="2">player</option>
                                <option value="3">viewer</option>
                                </select>
                            </div>
                        </div>
                        <div class="text-right">
                        <button class="btn btn-primary" type="submit" @click.prevent="changeNickname">
                            Join
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            user: {
                roomCode: '',
                name: '',
                role: 2,
                status: 'active'
            },
            needCode: true,
            nameError: null,
            codeError: false
        };
    },

    methods: {
        changeNickname(){
            if(this.user.name != ""){
                window.socket.emit('nicknameSet', this.user, returnVal => {
                    if (returnVal) {
                        this.nameError = 'Name is already in use';
                        return;
                    } else {
                        this.$parent.myUser = this.user;
                        $('#loginModal').modal('hide');
                    }
                });
            }else{
                this.nameError = 'Name cannot be blank';
            }
        },

        setRoomCode(){
            if(this.user.roomCode != ""){
                this.needCode = false;
            }else{
                this.codeError = 'The code cannot be empty.';
            }
        },
    },
}