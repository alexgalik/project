/**
 * Created by Home PC on 12.06.2017.
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {saveNews, fetchOneNews, updateNews} from '../actions/action'
import {Redirect} from 'react-router-dom'


class NewsForm extends Component {

    state = {
        news_id:  this.props.updNews ? this.props.updNews.news_id : null,
        title: this.props.updNews ? this.props.updNews.ntitle : '',
        text: this.props.updNews ? this.props.updNews.ntext : '',
        label: this.props.updNews ? 'Update news' : 'Add new news',
        errors: {},
        loading: false,
        done: false
    };

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            news_id: nextProps.updNews.news_id,
            title: nextProps.updNews.ntitle,
            text: nextProps.updNews.ntext
        })
    }



    handleChange = (e) =>{
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
    };

    handleSubmit = (e) => {
        e.preventDefault();
        //validation
        let errors = {};
        if (this.state.title === '') errors.title = "Can't be empty";
        if (this.state.text === '') errors.text = "Can't be empty";
        this.setState({errors});
        const isValid = Object.keys(errors).length === 0

        if (isValid){
            const {news_id, title, text} = this.state;
            this.setState({loading:true});
            if(news_id){
                this.props.updateNews({news_id, title, text}).then(
                    () => {this.setState({done: true})}
                );
            }else{
                this.props.saveNews({title, text}).then(
                    () => {this.setState({done: true})},
                    (err) => err.response.json().then(({errors}) => this.setState({errors, loading:false}))
                );
            }
        }
    };

    render(){
        const form = (
            <form className={classnames("ui", "form", {loading: this.state.loading})} onSubmit={this.handleSubmit}>
                <h1>{this.state.label}</h1>
                {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}
                <div className={classnames('field', {error: !!this.state.errors.title})}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={this.state.title}
                        onChange={this.handleChange}
                        id="title"
                    />
                    <span>{this.state.errors.title}</span>
                </div>
                <div className={classnames('field', {error: !!this.state.errors.text})}>
                    <label htmlFor="text">Text</label>
                    <input
                        type="text"
                        name="text"
                        value={this.state.text}
                        onChange={this.handleChange}
                        id="text"
                    />
                    <span>{this.state.errors.text}</span>
                </div>
                <div className="field">
                    <button className="ui primary button">Save</button>
                </div>
            </form>
        )
        return(
            <div>
                {this.state.done ? <Redirect to="/news"/> : form}
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    function findNews(news) {
        for (let i = 0; i< news.length; i++){
            if (news[i].news_id == match.params.news_id){
                return news[i]
            }
        }
    }
    const { match } = props;
    if(match.params.news_id){
        return{
            updNews: findNews(state.news)
        }
    }
    return{updNews: null};
}

export  default connect(mapStateToProps, {saveNews, fetchOneNews, updateNews})(NewsForm);