import React, { Component } from 'react';
import {Grid, Typography, IconButton, Card, LinearProgress} from '@material-ui/core';
import { PlayArrow, SkipNext, Pause } from '@material-ui/icons';


export default class SongPlayer extends Component {
    constructor(props) {
        super(props);
    }

    playSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type" : "application/json"}
        };
        fetch('/spotify_api/play-song/', requestOptions)
    }

    pauseSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type" : "application/json"}
        };
        fetch('/spotify_api/pause-song/', requestOptions)
    }

    skipSong = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type" : "application/json"}
        };
        fetch('/spotify_api/skip-song/', requestOptions)
    }

    render() {

        const songProgress = (this.props.time / this.props.duration) * 100;
        return(
        <Card>
            <Grid container alignItems='center' >
                <Grid item align='center' xs={4}>
                    <img  src={this.props.image_url} height='100%' width='100%' />
                </Grid>
                <Grid item align='center' xs={8}>
                    <Typography variant='h5' component='h5'>
                        {this.props.title}
                    </Typography>
                    <Typography>
                        {this.props.artist}
                    </Typography>
                    <div>
                        <IconButton onClick={() => {this.props.is_playing ?  this.pauseSong() : this.playSong()}} >
                            {this.props.is_playing ? <Pause/> : <PlayArrow />}
                        </IconButton>
                        <IconButton onClick={() => this.skipSong()}>
                            <SkipNext /> 
                            {`${this.props.votes} of ${this.props.required_votes}`}
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant='determinate' value={songProgress}/>
        </Card>
        )
    }
}