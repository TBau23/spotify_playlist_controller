import React, { Component } from 'react'

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        }; 
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomInfo()
    }

        getRoomInfo() {
            fetch('/api/get-room' + '?code=' + this.roomCode)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host
                })
            })
            
        }
        // in order to display room data, neet to give back end the code so that it can find the room 
    
    render() {
        return (
            <div>
                <h3>You are in room: {this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause === true ? 'True' : 'False'}</p>
                <p>Host: {this.state.isHost === true ? 'True' : 'False'}</p>
            </div>
        )
    }
}
