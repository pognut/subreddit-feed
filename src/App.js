import React, { Component } from 'react';
import Post from './Post.js'
import logo from './logo.svg';
import './App.css';
import 'whatwg-fetch'
import './font-awesome-4.7.0/css/font-awesome.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search:"",
      posts:{},
      currentSubreddit:"Welcome",
      // lowestPost
      route:"all",
      favCount:0
      //other subreddits: if feasible, keep all state of one sr here when changing to another


    };
    this.getSubredditTop = this.getSubredditTop.bind(this);
    this.createPost = this.createPost.bind(this);
    this.changeRoute = this.changeRoute.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);


  }

  updateSubredditSearch(input){
    this.setState({search:input})
  }

  getSubredditTop(){

  var makePost=this.createPost
  fetch('https://www.reddit.com/r/'+this.state.search+'/top/.json?limit=3')
    .then(function(response){
      return response.json()
    }).then(function(res){
      console.log(res)
      this.setState({posts:{}, currentSubreddit:"/r/"+this.state.search})
      res.data.children.map(function(post){
        makePost(post)
      })

    }.bind(this)).catch(function(ex) {
    alert("Subreddit not found. Please try again.")
    console.log('parsing failed', ex)
    })
  }

  createPost(post){
    var oldPosts = this.state.posts
    oldPosts[post.data.name]={author:post.data.author,title:post.data.title,key:post.data.name,isFav:false}
    if(post.data.preview!=undefined){
      oldPosts[post.data.name].thumb = post.data.preview.images[0].source.url
    }
    else if(post.data.selftext_html!=null){
      oldPosts[post.data.name].thumb = post.data.selftext
      oldPosts[post.data.name].isText=true
    }
    else if(post.data.domain==="puu.sh"){
      oldPosts[post.data.name].thumb = post.data.url
    }
    else{
      oldPosts[post.data.name].thumb = post.data.url
    }
    this.setState({posts:oldPosts})
  }

  addToFavorites(post){
    console.log(post, this.state.posts)
    if(this.state.posts[post.key].isFav===false){
      var oldFavorites = this.state.posts
      var count = this.state.favCount +=1;
      oldFavorites[post.key].isFav=true;
      this.setState({posts:oldFavorites, favCount:count})
    }
    else{
      var oldFavorites = this.state.posts
      var count = this.state.favCount -=1;
      oldFavorites[post.key].isFav=false;
      this.setState({posts:oldFavorites, favCount:count})
    }
  }

  changeRoute(destination){
    this.setState({route:destination})
  }

  render() {
    if(this.state.route==="all"){
      var posts = []
      var curr = "blueBack"
      var favo = "whiteBack"
      for(var key in this.state.posts){
        posts.push(this.state.posts[key])
      }
    }
    else if(this.state.route==="favorites"){
      var posts = []
      var favo = "blueBack"
      var curr = "whiteBack"
      for(var key in this.state.posts){
        if(this.state.posts[key].isFav===true){
          posts.push(this.state.posts[key])
        }
      }
    }
    //use state to change css classes so that current route is highlighted

    return (
      <div className="App">
        <div className="container">
          <div className="row top-nav no-gutters">
            <div className={"col-xs-2"}>
              <button className={"btn btn-default "+curr} onClick={() => this.changeRoute("all")}>{this.state.currentSubreddit}</button>
            </div>
            <div className="col-xs-6 searchBar">
              <input onChange={(e)=>this.updateSubredditSearch(e.target.value)}></input>
              <button className="searchButton btn btn-default" onClick={this.getSubredditTop}>Search</button>
            </div>
            <div className="col-xs-4">
              <button className={"btn btn-default "+favo} onClick={() => this.changeRoute("favorites")}>Favorites ({this.state.favCount})</button>
            </div>
          </div>
          <div>
            {posts.map((post) => {return <Post info={post} key={post.key} setFav={this.addToFavorites} />})}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
