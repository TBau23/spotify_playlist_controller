import React, { Component } from 'react';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { Link } from'react-router-dom';

export default class JoinRoomPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode : '',
            error : ''
        }
        
    }

    handleCodeChange = (e) => {
        this.setState({roomCode : e.target.value})
    }

    handleJoinRoom = () => {
        // send post reuqest to back end, see if room exists, if so, join it
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: this.state.roomCode
            }),
        };
        fetch('/api/join-room/', requestOptions)
        .then(res => {
            if(res.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`)
            } else {
                this.setState({
                    error: 'Room not found',
                    code: ''
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
        
        
    }

    render() {
        return (
            <Grid container spacing={1} >
                <Grid item xs={12} align='center'>
                    <Typography variant='h4' component='h4'>
                        Join A Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <TextField
                        error={this.state.error.length === 0 ? false : true}
                        label='Room Code'
                        placeholder='Enter Room Code'
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant='outlined'
                        onChange={this.handleCodeChange}
                        style={{color:'white'}}
                    />
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button variant='outlined' color='secondary' onClick={this.handleJoinRoom}>
                        Enter
                    </Button>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button variant='outlined' style={{borderColor: '#3FEEE6', color: '#3FEEE6'}} to='/' component={Link}>
                        Back
                    </Button>
                </Grid>
                

            </Grid>
        )
    }
}
