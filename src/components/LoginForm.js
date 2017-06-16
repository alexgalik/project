/**
 * Created by Home PC on 15.06.2017.
 */
import React, {Component} from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {login} from '../actions/action'
import {Redirect, withRouter} from 'react-router-dom'

class LoginForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            errors:{},
            usereroors:'',
            loading: false,
            done: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit =(e)=>{
        e.preventDefault();
        let errors = {};
        if (this.state.username === '') errors.username = "Can't be empty";
        if (this.state.password === '') errors.password = "Can't be empty";
        this.setState({errors});
        const isValid = Object.keys(errors).length === 0
        if(isValid){
            const {username, password} = this.state;
            this.setState({loading:true});
            this.props.login({username, password}).then(
                () => {this.setState({done: true})},
                (err) => {this.setState({usereroors: err.error})}
            )
        }
    }

    onChange=(e)=>{
        if (!!this.state.errors[e.target.name]){
            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];
            this.setState({
                [e.target.name]: e.target.value,
                errors
            });
        } else{
            this.setState({[e.target.name]: e.target.value});
        }
    }


    render(){
        const { username, password} = this.state;
        const loginForm = (
            <form className="ui form" onSubmit={this.onSubmit}>
                {!!this.state.usereroors && <div className="ui negative message"><p>{this.state.usereroors}</p></div>}
                <div className={classnames('field', {error: !!this.state.errors.username})}>
                    <label htmlFor="username">Login</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        id="title"
                    />
                    <span>{this.state.errors.username}</span>
                </div>
                <div className={classnames('field', {error: !!this.state.errors.password})}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        id="title"
                    />
                    <span>{this.state.errors.password}</span>
                </div>
                <div className="field">
                    <button className="ui primary button">Save</button>
                </div>
            </form>
        )
        return(
           <div>
               {this.state.done ? <Redirect to="/news"/> : loginForm}
           </div>
        )
    }
}

export default withRouter(connect(null, {login})(LoginForm))