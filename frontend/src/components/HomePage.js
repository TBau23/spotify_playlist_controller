import React, { Component } from 'react';
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class Homepage extends Component {
    constructor(props) {
        super(props)
    

    }

    // when this page loads we want to check if the user's session is already tied to an active room so they can easily rejoin

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align='center'>
                    <Typography variant='h3' component='h3'>
                        Remote Rave
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <ButtonGroup disableElevation variant='outlined' color='primary' size='large'>
                        <Button style={{backgroundColor:'#3FEEE6'}} to='/join' component={ Link } > Join A Room</Button>
                        <Button color='secondary' variant='outlined' to='/create' component={ Link } > Create A Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }
}
