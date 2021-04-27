import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';
import SongPlayer from './SongPlayer'


export default class Room extends Component {


    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuth: false,
            currentSong: {}
            
        }; 
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomInfo();
        this.getCurrentSong();
    }

    componentDidMount = () => {
        // spotify api doesn't support websockets so we have to continuously ping the endpoint to check on updates to song status
        this.interval = setInterval(this.getCurrentSong,1000) 
    }

    componentWillUnmount = () => {
        // clean up right before component is destroyed. need to stop pinging
        clearInterval(this.interval);
    }



    // in order to display room data, neet to give back end the code so that it can find the room 
    getRoomInfo = () => {
        fetch('/api/get-room/' + '?code=' + this.roomCode)
        .then(res => {
            if(!res.ok) { // if the response is not valid e.g. the room doesn't exist, redirect back to home page
                this.props.clearRoom();
                this.props.history.push('/')
            }
            return res.json()
        })
        .then(data => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            })
            if(this.state.isHost) {
                console.log('wooh')
                this.authenticateHostSpotify()
            }
        })
    }

    authenticateHostSpotify = () => {
        // we only want to run this after room details method has set host state
        fetch('/spotify_api/is-authenticated/')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            this.setState({
                spotifyAuth: data.status
            })
            if(!data.status) {
                fetch('/spotify_api/get-auth-url/')
                .then(res => res.json())
                .then(data => {
                    window.location.replace(data.url);
                    
                })
            }
        })

    }

    getCurrentSong = () => {
        fetch('/spotify_api/current-song')
        .then(res => {
            if(!res.ok) {
                return {}
            } else {
                return res.json()
            }
        })
        .then(data => {
            this.setState({
                currentSong: data['Current Song']
            })
           
        })
    }

    leaveRoom = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }
        fetch('/api/leave-room/', requestOptions).then((res) => {
            this.props.clearRoom();
            this.props.history.push('/')
        })
    }

    toggleShowSettings = (value) => {
        this.setState({
            showSettings: value
        })
    }

    renderSettingsButton = () => {
        return (
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='primary' onClick={() => this.toggleShowSettings(true)}>Settings</Button>
            </Grid>
        )
    }

    


    renderSettingsModal = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <CreateRoomPage
                        update={true}
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.roomCode}
                        updateCallback={() => this.getRoomInfo()}
                    />
                </Grid>
                
                <Grid item xs={12} align='center' >
                    <Button variant='contained' color='secondary' onClick={() => this.toggleShowSettings(false)}> Close</Button>
                </Grid>
            </Grid>
        )
    }
    
    render() {
        if(this.state.showSettings) {
            return this.renderSettingsModal();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' >
                    <Typography variant='h4' component='h4' >
                        Code: {this.roomCode}
                    </Typography> 
                </Grid>
                <SongPlayer {...this.state.currentSong} />
                {this.state.isHost === true ? this.renderSettingsButton() : null}
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


// <Grid item xs={12} align='center' >
{/* <Typography variant='h6' component='h6' >
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
</Grid> */}