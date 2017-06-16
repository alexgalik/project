import React, { Component } from 'react';
import {connect} from 'react-redux';
import NewsList from './NewsList';
import {fetchNews, newsDelete} from '../actions/action'

class NewsPage extends Component {
	componentWillMount(){
		this.props.fetchNews();
	}
	render(){
		return(
			<div>
				<h1>NewsPage</h1>
				<NewsList news = {this.props.news} newsDelete ={this.props.newsDelete}/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return{
		news: state.news
	}
}
export default connect(mapStateToProps, {fetchNews, newsDelete})(NewsPage);