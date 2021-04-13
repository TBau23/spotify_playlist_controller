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
                        error={this.state.error}
                        label='Room Code'
                        placeholder='Enter Room Code'
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant='outlined'
                        onChange={this.handleCodeChange}
                    />
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button variant='contained' color='primary' >
                        Enter
                    </Button>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button variant='contained' color='secondary' to='/' component={Link}>
                        Back
                    </Button>
                </Grid>
                

            </Grid>
        )
    }
}
