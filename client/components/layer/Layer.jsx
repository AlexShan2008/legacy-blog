import React ,{ Component } from 'react';
import './Layer.scss';

class  Layer  extends Component{
    constructor (props){
        super(props);
        this.state = {
            showFlag:this.props.showFlag
        };
        this.handleClick=this.handleClick.bind(this)
    }

    handleClick(e){
        e.preventDefault();
        this.setState({
            showFlag: "layer-wrap"
        })
    }

    render(){
        return(
            <div className={this.props.showFlag}>
                <div className="layer-container">
                    <div className="closeBtn-wrap">
                        <button type="button" className="closeBtn" onClick={this.handleClick}>
                            <svg viewBox="0 0 24 24" role="img" aria-label="关闭" focusable="false"><path d="m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22"></path></svg>
                        </button>
                    </div>

                </div>
            </div>
        )
    }
}

export default  Layer;
