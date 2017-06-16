/**
 * Created by Home PC on 12.06.2017.
 */
import React from 'react';
import {Link} from 'react-router-dom'

export default function NewsCard({news, newsDelete}) {
    return(
        <div className="ui card">
            <div className="content">
                <div className="header">{news.ntitle}</div>
                <div className="column"><p>{news.ntext}</p></div>
            </div>
            <div className="extra content">
                <div className="ui two buttons">
                    <Link to = {`/enews/${news.news_id}`} className="ui basic button green">Edit</Link>
                    <div className="ui basic button red" onClick={()=>newsDelete(news.news_id)}>Delete</div>
                </div>
            </div>
        </div>
    )
}