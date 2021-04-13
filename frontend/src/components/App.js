import React, {Component} from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import JoinRoomPage from './JoinRoomPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode : null,
        }
    }

    async componentDidMount() {
        // were performing an async operation within this method. without async keyword, we will have to wait for it to run before
        // anything else works
        fetch('/api/user-in-room/')
        .then(res => res.json())
        .then(data => {
           this.setState({
               roomCode: data.code
           })
        })
   }

    render() {
        return (
            <div className='center'>
                <Router>
                    <Switch >
                        
                        <Route path ='/join' component={JoinRoomPage} />
                        <Route path ='/create' component={CreateRoomPage} />
                        <Route path='/room/:roomCode' component={Room} />
                        <Route exact path='/' render={() => {
                            return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`} />) : (<HomePage />)}
                            } />
    
                    </Switch>
                    
                </Router>
                
            </div>
            
        )
    }
}

const appDiv = document.getElementById("app")
render(<App />, appDiv)