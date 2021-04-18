import React, { Component } from 'react'
import { Button, Grid, Typography, TextField, FormControl, FormHelperText, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Link } from'react-router-dom';

export default class CreateRoomPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };

    }

    defaultVotes = 2

    handleVotesChange = (e) => {
        this.setState({votesToSkip: parseInt(e.target.value)});
    }

    handleGuestCanPause = (e) => {
        this.setState({guestCanPause: e.target.value === 'true' ? true : false});
    }

    handleCreateRoom = () => {
        // if you want access to the this keyword from dom events you need to bind them
        // send request to create room endpoint 
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };
        fetch("/api/create-room/", requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.props.history.push('/room/' + data.code)
                });
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Typography component='h4' variant='h4'>
                        Create A Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <FormControl component='fieldset' >
                        <FormHelperText>
                            <div align='center'>
                                Guest Control Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue='true' onChange={(e) => this.handleGuestCanPause(e)}>
                            <FormControlLabel
                            value='true'
                            control={<Radio color='primary' />}
                            label='Play/Pause'
                            labelPlacement='bottom'
                            />
                            <FormControlLabel
                            value='false'
                            control={<Radio color='secondary' />}
                            label='No Control'
                            labelPlacement='bottom'
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align='center'>
                    <FormControl >
                        <TextField 
                        onClick={(e) => this.handleVotesChange(e)}
                        required={true}
                         type='number'
                          defaultValue={this.defaultVotes}
                          inputProps = {{
                              min: 1,
                              style: {textAlign: 'center'}
                          }}
                          />
                          <FormHelperText>
                              <div align='center'>
                                Votes Required to Skip Song
                              </div>
                          </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button color='secondary' variant='contained' onClick={() => this.handleCreateRoom()} >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button style={{backgroundColor: 'orange'}} variant='contained' to='/' component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }
}
