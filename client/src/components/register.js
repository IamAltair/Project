export class Register extends Component {
    categories = [];
    title = '';
    picture = '';
    content = '';
    category = '';
    importance = 0;

    render(){
        return(
            <div id='register'>
                <Navbar />
                <Alert />
                <div id='register-form' className='card'>
                    <form style={{margin: '10px'}}>
                        <div className='form-group'>
                            <label style={{float: 'left'}}>Title</label>
                            <input
                                type='text'
                                className='form-control'
                                value={this.title}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}
                            ></input>
                        </div>
                        <div className='form-group'>
                            <label style={{float: 'left'}}>Picture URL</label>
                            <input
                                type='text'
                                className='form-control'
                                value={this.picture}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.picture = event.target.value)}
                            ></input>
                        </div>
                        <div className='form-group'>
                            <label>Text</label>
                            <textarea
                                className='form-control'
                                rows='5'
                                value={this.conent}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.content = event.target.value)}
                            ></textarea>
                        </div>

                        <label>Category</label>
                        <select
                            className='selectpicker browser-default custom-select'
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.category = event.target.value)}
                            defaultValue=''
                        >
                            <option disabled value=''> -- select category -- </option>
                            {this.categories.map(category => (
                                <option key={category.id} value={category.type}>
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
                                   onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                       (this.importance = Number(event.target.value))}/>
                            <label className='form-check-label'>
                                Important
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
                                Less Important
                            </label>
                        </div>
                        <button
                            type='button'
                            className='btn btn-primary'
                            style={{marginTop: '20px'}}
                            onClick={() => this.register()}>Register</button>
                    </form>
                </div>
            </div>
        );
    }

    async register(){
        var valid = true;
        if (this.title.trim() == ''){
            valid = false;
            Alert.danger('Title required');
        }
        if (this.category.trim() == ''){
            valid = false;
            Alert.danger('Category required');
        }
        if (this.importance == 0){
            valid = false;
            Alert.danger('Importance required');
        }
        if (this.picture.trim() == '') this.picture = 'https://tinyurl.com/y73nxqn9';

        if(valid)
            articleService.createArticle(this.title, this.content, this.picture, this.category, this.importance)
                .then(history.replace('/'), window.location.reload());
    }

    mounted(){
        articleService.getCategories()
            .then((categories => (this.categories = categories)))
            .catch((error: Error) => console.log(error.message));
    }

}
