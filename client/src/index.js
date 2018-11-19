// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Alert } from './widgets';
import { articleService, studentService } from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
    let script = document.createElement('script');
    script.src = '/reload/reload.js';
    if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//dateformat rounds of to minute
function getDate(date){
    var dateObject = new Date(date);
    dateObject.setSeconds(0,0);
    return(dateObject.toISOString().replace('T', ' ').replace(':00.000Z', ''));
}

class Home extends Component {
    render() {
        return (
            <div id='home'>
              <Alert />
              <Feed />
              <MainContent />
            </div>
        );
    }
}

class Navbar extends Component {
    render() {
        return(
            <div class = "articleGrid">
                <div>
                    <nav id='navbar' className='navbar navbar-dark bg-dark'>
                      <a id='navbar-title' className='navbar-brand' onClick={() => this.toHome()} >Readit</a>
                      <form className='form-inline'>
                        <NavLink to='/register'>
                          <button className='btn btn-dark' type='button'>Make a post ✎</button>
                        </NavLink>
                      </form>
                    </nav>
                </div>
            </div>
        );
    }

    toHome(){
        history.push('/');
        window.location.reload();
    }
}

class Feed extends Component {
    articles = [];

    render() {
        return(
            <div class="articleGrid">
            <div id='feed'>
                {this.articles.map(article =>
                    <NavLink key={article.id} to={'/article/' + article.id}>
                      <div className='feed-item'>{article.title + ' (' + getDate(article.createdAt) + ')'}</div>
                    </NavLink>
                )}
            </div>
            </div>
        );
    }

    mounted(){
        articleService.getArticles()
            .then(articles => (this.articles = articles, this.runCarousel()))
            .catch((error: Error) => console.log(error.message));
    }

    runCarousel(){
        $(document).ready(function() {
            $('#feed').slick({
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
                speed: 400,
                autoplaySpeed: 3000,
                arrows: false,
                pauseOnHover: true
            });
        });
    }
}


class MainContent extends Component {
    articles = [];
    categories = [];
    showing = [];
    filterOpen = false;

    render() {
        return(
            <div class="articleGrid">
            <div id='main-content-wrapper'>
              <div id="bar-filter" className="w3-bar w3-dark-grey" >

                  {this.categories.map(category => (
                      <a
                          key={category.id}
                          href='#'
                          className='w3-bar-item w3-button'
                          onClick={() => this.filter(category.type)}
                      >
                          {category.type}
                      </a>
                  ))}
              </div>
              <div id='main-content'>
                  {this.showing.map(article => (
                      <Article
                          key={article.id}
                          articleId={article.id}
                          title={article.title}
                          date={article.createdAt}
                          picture={article.picture}
                          category={article.category}
                      ></Article>
                  ))}
              </div>
            </div>
            </div>
        );
    }

    filter(category){
        let cap = 50;
        console.log(category);
        this.showing = this.articles.filter(article => ((article.category == category) && (cap-- > 0)));
    }

    mounted(){
        let cap = 50;
        articleService.getArticles()
            .then((articles => (this.articles = articles, this.showing = articles.filter((article) => (cap-- > 0 && article.importance == 1)))),
                articleService.getCategories()
                    .then(categories => (this.categories = categories))
                    .catch((error: Error) => console.log(error.message))
            )
            .catch((error: Error) => console.log(error.message));
    }
}

class Article extends Component<{articleId: number, title: string, date: Date, picture: String, category: string}> {
    toggle = this.toggle.bind(this);
    optionsOpen = false;

    render() {
        return(
            <div className='card article'>
              <img className='card-img-top article-image' src={this.props.picture} alt='Card image'></img>
              <div className='card-body article-body'>
                <NavLink to={'/article/' + this.props.articleId}>
                  <h5 className='card-title article-title'>{this.props.title}</h5>
                </NavLink>
                <h6 className='card-text article-category'>{this.props.category}</h6>
                <h6 className='card-text article-date'>{getDate(this.props.date)}</h6>

                <Dropdown className='article-options' direction="up" isOpen={this.optionsOpen} toggle={this.toggle}>
                  <DropdownToggle color="info" caret>
                      ⚙️
                  </DropdownToggle>
                  <DropdownMenu>
                    <NavLink to={'/article/' + this.props.articleId + '/edit'}>
                      <DropdownItem style={{color: 'teal'}}>Edit</DropdownItem>
                    </NavLink>
                    <DropdownItem style={{color: 'red'}} onClick={() => this.delete(this.props.articleId)}>Delete</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

              </div>
            </div>
        );
    }

    toggle() {
        this.optionsOpen ? this.optionsOpen = false : this.optionsOpen = true;
    }

    delete(id){
        articleService.deleteArticle(id)
            .then(window.location.reload())
            .catch((error: Error) => Alert.danger(error.message));
    }

}

class ArticleInfo extends Component<{ match: { params: { id: number } } }> {
    article = null;

    render(){
        if(!this.article) return null;

        return(
            <div id='article-info'>
              <img id='article-info-picture' src={this.article.picture} alt='Article front image' />
              <div id='article-info-top-wrapper'>
                <h6 id='article-info-category'> {this.article.category} </h6>
                <h1 id='article-info-title'>{this.article.title}</h1>
                <h6> ({getDate(this.article.createdAt)}) </h6>
              </div>
              <div id='article-info-content'>
                <p>{this.article.content}</p>
              </div>
            </div>
        );
    }

    mounted(){
        articleService.getArticle(this.props.match.params.id)
            .then(article => (this.article = article))
            .catch((error: Error) => console.log(error.message));
    }
}

class ArticleEdit extends Component<{ match: { params: { id: number } } }> {
    article = null;
    categories = [];

    render(){
        if(!this.article) return null;

        return(
            <div id='register'>
              <Alert />
              <div id='register-wrapper'>
                <div id='register-form' className='card'>
                  <form style={{margin: '10px'}}>
                    <div style={{textAlign: 'center'}}>
                      <h5 className='card-title'>Edit article</h5>
                    </div>
                    <div className='form-group'>
                      <label style={{float: 'left'}}>Title</label>
                      <input
                          type='text'
                          className='form-control'
                          value={this.article.title}
                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.title = event.target.value.trim())}
                      ></input>
                    </div>
                    <div className='form-group'>
                      <label style={{float: 'left'}}>Picture URL</label>
                      <input
                          type='text'
                          className='form-control'
                          value={this.article.picture}
                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.picture = event.target.value.trim())}
                      ></input>
                    </div>
                    <div className='form-group'>
                      <label>Text</label>
                      <textarea
                          className='form-control'
                          rows='10'
                          value={this.article.content}
                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.content = event.target.value.trim())}
                      ></textarea>
                    </div>

                    <label>Category</label>
                    <select
                        className='selectpicker browser-default custom-select'
                        defaultValue={this.article.category}
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.category = event.target.value)}
                    >
                        {this.categories.map(category => (
                            <option
                                key={category.id}
                                value={category.type}
                            >
                                {category.type}
                            </option>
                        ))}
                    </select>
                    <label style={{marginTop: '20px'}}>Importance</label><br/>
                    <div className='form-check importance'>
                      <input className='form-check-input'
                             type='radio'
                             name='exampleRadios'
                             value='1'
                             checked={(this.article.importance == 1) ? 'checked' : ''}
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                 (this.article.importance = Number(event.target.value))}/>
                      <label className='form-check-label'>
                        Important
                      </label>
                    </div>
                    <div className='form-check'>
                      <input className='form-check-input'
                             type='radio'
                             name='exampleRadios'
                             value='2'
                             checked={(this.article.importance == 2) ? 'checked' : ''}
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                 (this.article.importance = Number(event.target.value))}
                      />
                      <label className='form-check-label'>
                        Less Important
                      </label>
                    </div>
                    <button
                        type='button'
                        className='btn btn-primary'
                        style={{marginTop: '20px'}}
                        onClick={() => this.save()}>Save</button>
                  </form>
                </div>
              </div>
            </div>
        );
    }

    async save(){
        var valid = true;
        if (this.article.title == ''){
            valid = false;
            Alert.danger('Title required');
        } else if (this.article.length > 64){
            valid = false;
            Alert.danger('Max title characters: 64');
        }
        if (this.article.category.trim() == ''){
            valid = false;
            Alert.danger('Category required');
        }
        if ((this.article.importance != 1) && (this.article.importance != 2)){
            valid = false;
            Alert.danger('Importance required');
        }

        if(valid){
            if (this.article.picture.trim() == '') this.article.picture = 'https://tinyurl.com/y73nxqn9';
            articleService.updateArticle(this.article)
                .then(history.replace('/'), window.location.reload())
                .catch((error: Error) => Alert.danger(error.message));
        }
    }

    mounted(){

        articleService.getCategories()
            .then((categories => (this.categories = categories)),
                articleService.getArticle(this.props.match.params.id)
                    .then((article => (this.article = article)))
                    .catch((error: Error) => console.log(error.message))
            )
            .catch((error: Error) => console.log(error.message));

    }
}

class Register extends Component {
    categories = [];
    title = '';
    picture = '';
    content = '';
    category = '';
    importance = 0;

    render(){
        return(
            <div id='register'>
              <Alert />
              <div id='register-wrapper'>
                <div id='register-form' className='card'>
                  <form style={{margin: '20px'}}>
                    <div style={{textAlign: 'left'}}>
                      <h5 className='card-title'>Make a post</h5>
                    </div>
                    <div className='form-group'>
                      <label style={{float: 'left'}}>Title</label>
                      <input
                          type='text'
                          className='form-control'
                          value={this.title}
                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value.trim())}
                      ></input>
                    </div>
                    <div className='form-group'>
                      <label style={{float: 'left'}}>Image link</label>
                      <input
                          type='text'
                          className='form-control'
                          value={this.picture}
                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.picture = event.target.value.trim())}
                      ></input>
                    </div>
                    <div className='form-group'>
                      <label>Text</label>
                      <textarea
                          className='form-control'
                          rows='10'
                          value={this.content}
                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.content = event.target.value.trim())}
                      ></textarea>
                    </div>
                    <label>Category</label>
                    <select
                        className='selectpicker browser-default custom-select'
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.category = event.target.value)}
                        defaultValue=''
                    ><option disabled value=''> -- select category -- </option>
                        {this.categories.map(category => (
                            <option key={category.id} value={category.type}>
                                {category.type}
                            </option>
                        ))}
                    </select>
                    <label style={{marginTop: '20px'}}>Is this post important?</label><br/>
                    <div className='form-check importance'>
                      <input className='form-check-input'
                             type='radio'
                             name='exampleRadios'
                             value='1'
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                 (this.importance = Number(event.target.value))}/>
                      <label className='form-check-label'>
                        Yes
                      </label>
                    </div>
                    <div className='form-check'>
                      <input className='form-check-input'
                             type='radio'
                             name='exampleRadios'
                             value='2'
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                 (this.importance = Number(event.target.value))}
                      />
                      <label className='form-check-label'>
                        No
                      </label>
                    </div>
                    <button
                        type='button'
                        className='btn btn-dark'
                        style={{marginTop: '20px'}}
                        onClick={() => this.register()}>Publish</button>
                  </form>
                </div>
              </div>
            </div>
        );
    }

    async register(){
        var valid = true;
        if (this.title == ''){
            valid = false;
            Alert.danger('Title required');
        } else if (this.title.length > 64){
            valid = false;
            Alert.danger('Max title characters: 64');
        }
        if (this.category.trim() == ''){
            valid = false;
            Alert.danger('Category required');
        }
        if ((this.importance != 1) && (this.importance != 2)){
            valid = false;
            Alert.danger('Importance required');
        }

        if(valid){
            if (this.picture.trim() == '') this.picture = 'https://tinyurl.com/y73nxqn9';
            articleService.createArticle(this.title.trim(), this.content.trim(), this.picture.trim(), this.category, this.importance)
                .then(history.replace('/'), window.location.reload())
                .catch((error: Error) => Alert.danger(error.message));
        }
    }

    mounted(){
        articleService.getCategories()
            .then((categories => (this.categories = categories)))
            .catch((error: Error) => console.log(error.message));
    }
}


const root = document.getElementById('root');

function renderRoot(){
    if (root)
        ReactDOM.render(
            <HashRouter>
              <div id='page'>
                <Navbar />
                <Route exact path='/' component={Home} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/article/:id' component={ArticleInfo} />
                <Route exact path='/article/:id/edit' component={ArticleEdit} />
              </div>
            </HashRouter>,
            root
        );
}

renderRoot();
