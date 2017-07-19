import React, { Component } from 'react';
import './Post.css';


class Post extends Component{
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  //do i need state here?

  render() {
    if(this.props.info.isText==true){
      var content = [<h3>{this.props.info.title}</h3>,<p className="selfText">{this.props.info.thumb}</p>];

    }
    else{
      var content = [<img className="thumb" src={this.props.info.thumb} />,<h3>{this.props.info.title}</h3>]
    }

    if(this.props.info.isFav==true){
      var heart = "fa-heart favHeartFull";
    }
    else{
      var heart = "fa-heart-o favHeartEmpty";
    }
    return(
      <div className="row post no-gutters">
        <div className="col-xs-12 upper">
          {content}

        </div>
        <div className="col-xs-12 lower">
          {this.props.info.author}
          <i className={"fa "+heart} onClick={()=> {this.props.setFav(this.props.info)}}></i>
        </div>
      </div>
      )
  }

}



export default Post
