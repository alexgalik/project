/**
 * Created by Home PC on 15.06.2017.
 */

import React, { Component } from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import NewsPage from './NewsPage'
import NewsForm from './NewsForm'
import LoginPage from './LoginPage'
import { connect } from 'react-redux';
import { logout } from '../actions/action';
import requireAuth from '../utils/requireAuth';
import requireUser from '../utils/requireUser';

const ActiveLink = ({ label, to, activeOnlyWhenExact }) => (
    <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
        <Link className={match ? 'active item' : 'item'} to={to}>{label}</Link>
    )} />
);

class NavigationBar extends Component {
    logout(e) {
        e.preventDefault();
        this.props.logout();
    }
    render() {
        const  {isAuthenticated}  = this.props.auth;

        const adminLinks = (
            <div className="container">
                <div className="ui four item menu">
                    <ActiveLink activeOnlyWhenExact to="/" label="Home" />
                    <ActiveLink activeOnlyWhenExact to="/news" label="News" />
                    <ActiveLink activeOnlyWhenExact to="/news/new" label="Add New News" />
                    <div className="item" onClick={this.logout.bind(this)}>Logout</div>
                </div>
            </div>

        );

        const userLinks = (
            <div className="container">
                <div className="ui two item menu">
                    <ActiveLink activeOnlyWhenExact to="/" label="Home" />
                    <ActiveLink activeOnlyWhenExact to="/login" label="Login" />
                </div>
            </div>

        );

        return (
            <div >
                { isAuthenticated ? adminLinks : userLinks }
                    <Route exact path = "/news" component={requireAuth(NewsPage)}></Route>
                    <Route path = "/news/new" component={requireAuth(NewsForm)}></Route>
                    <Route path = "/enews/:news_id" component={requireAuth(NewsForm)}></Route>
                    <Route path = "/login" component={requireUser(LoginPage)}></Route>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default withRouter(connect(mapStateToProps, {logout})(NavigationBar));