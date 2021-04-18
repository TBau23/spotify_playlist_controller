import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';



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

        getRoomInfo = () => {
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

        leaveRoom = () => {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            }
            fetch('/api/leave-room/', requestOptions).then((res) => {
                this.props.history.push('/')
            })
        }
        // in order to display room data, neet to give back end the code so that it can find the room 
    
    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' >
                    <Typography variant='h4' component='h4' >
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' >
                    <Typography variant='h6' component='h6' >
                        Host: {this.state.isHost === true ? 'True' : 'False'}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' >
                    <Typography variant='h6' component='h6' >
                        Votes to Skip Song: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' >
                    <Typography variant='h6' component='h6' >
                        Guest can Pause: {this.state.guestCanPause === true ? 'True' : 'False'}
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center' >
                    <Button variant='contained' color='secondary' onClick={this.leaveRoom}> Leave Room</Button>
                </Grid>
                

            </Grid>
        )
    }
}

//<div>
{/* <h3>You are in room: {this.roomCode}</h3>
<p>Votes: {this.state.votesToSkip}</p>
<p>Guest Can Pause: {this.state.guestCanPause === true ? 'True' : 'False'}</p>
<p>Host: {this.state.isHost === true ? 'True' : 'False'}</p>
</div> */}