/**
 * Created by Home PC on 15.06.2017.
 */
import React, {Component} from 'react';
import LoginForm from './LoginForm'

class LoginPage extends Component{
    render(){
        return(
            <div>
                <h1>Login Page</h1>
                <LoginForm></LoginForm>
            </div>
        )
    }
}
export default LoginPage