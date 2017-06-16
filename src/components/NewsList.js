import React from 'react';
import NewsCard from './NewsCard';

export default function NewsList({news, newsDelete}){
	const emptyMessage = (
			<p> There are no news yet </p>
		);
	const newsList = (
		<div className="ui four cards">
			{news.map(news => <NewsCard news={news} key ={news.news_id} newsDelete = {newsDelete}/>)}
		</div>
		);
	return(
		<div>
			{news.length === 0 ? emptyMessage : newsList}
		</div>
	)
}