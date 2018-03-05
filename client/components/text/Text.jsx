/**
 * Created by ShanGuo on 2017/12/21.
 */
import "./Text.scss";
import React, {Component} from "react";

const articleData = [
    {
        "id": 1,
        "topic":"Front End",
        "title": "The #MyFutureMe winner is often the only girl—but she’s going to change that",
        "content": "After you became a finalist, you attended TEDWomen. What was that like?"
    },
    {
        "id": 2,
        "topic":"Full Stack",
        "title": "02The #MyFutureMe winner is often the only girl—but she’s going to change that",
        "content": "02After you became a finalist, you attended TEDWomen. What was that like?"
    }
];

function Topic(props) {
    return (
        <span className="readArticle_topic">
            {props.topic}
        </span>
    );
}

function Title(props) {
    return (
        <h3 className="readArticle_title">
            {props.title}
        </h3>
    );
}

function Paragraph(props) {
    return (
        <p className="readArticle_content">
            {props.content}
        </p>
    );
}

function ReadArticle() {
    return (
        <p className="readArticle_link">
            READ ARTICLE
        </p>
    );
}

class Text extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="text float-r">
                <Topic topic={articleData[0].topic}/>
                <Title title={ articleData[0].title }/>
                <Paragraph content={ articleData[0].content } />
                <ReadArticle/>
            </div>
        );
    }

}
export default Text;