import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import JoinRoomPage from './JoinRoomPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';

export default class Homepage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Router>
                <Switch >
                    
                    <Route path ='/join' component={JoinRoomPage} />
                    <Route path ='/create' component={CreateRoomPage} />
                    <Route path='/room/:roomCode' component={Room} />
                    <Route exact path='/'>
                        <p>This is home page</p>
                    </Route>
                </Switch>
                
            </Router>
        )
    }
}
