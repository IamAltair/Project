// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert } from './widgets';
import { caseService } from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


class Menu extends Component {
    render() {
        return (
            <NavBar>
                <NavBar.Brand>Public Paper</NavBar.Brand>
                <NavBar.Link to="/">New Case </NavBar.Link>
                <NavBar.Link to="/">Tags</NavBar.Link>
            </NavBar>
        );
    }
}

class Home extends Component {
    cases = [];
    render() {
        return (
            <div>
                {this.cases.map(e => (
                  <Card className="cc-size" title={e.title}>
                    <ListGroup.Item>
                      <img className="card-img-top" src={e.img} alt={e.img} />
                    </ListGroup.Item>
                  </Card>
                ))}
          </div>
        );
  }
    mounted() {
        caseService
            .getCases()
            .then(cases => (this.cases = cases))
            .catch((error: Error) => Alert.danger(error.message));
    }

}

class CaseList extends Component {
    cases = [];
    render() {
        return (
            <div>
                {cases.map(e => (
                    <Card className="cc-size" title={e.title}>
                        <ListGroup.Item>
                            <img className="card-img-top" src={e.img} alt={e.img} />
                        </ListGroup.Item>
                        <ListGroup.Item to={'/case/' + e.id}>Comments</ListGroup.Item>
                    </Card>
                ))}
            </div>
        );
    }
    mounted() {
        caseService
            .getCases()
            .then(cases => (this.cases = cases))
            .catch((error: Error) => Alert.danger(error.message));
    }
}


class CaseDetails extends Component<{ match: { params: { id: number } } }> {
    case = null;
    render() {
        if (!this.case) return null;
        return (
            <ListGroup>
                <Card title={this.case.title}>
                    <ListGroup.Item>
                        <img className="card-img-top" src={this.case.img} alt="Image Cap" />
                    </ListGroup.Item>
                    <ListGroup.Item>{this.case.text}</ListGroup.Item>
                </Card>
            </ListGroup>
        );
    }
    mounted() {
        caseService
            .getCase(this.props.match.params.id)
            .then(casex => (this.case = casex))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class CaseEdit extends Component<{ match: { params: { id: number } } }> {
  case = null;

  render() {
    if (!this.case) return null;
    return (
      <form>
        <ul>
          <li>
            Title:{' '}
            <input
              type="text"
              value={this.case.title}
              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                if (this.case) this.case.title = event.target.value;
              }}
            />
          </li>
          <li>
            Text:{' '}
            <input
              type="text"
              value={this.case.text}
              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                if (this.case) this.case.lastName = event.target.value;
              }}
            />
          </li>
          <li>
            Image:{' '}
            <input
              type="text"
              value={this.case.img}
              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                if (this.case) this.case.img = event.target.value;
              }}
            />
          </li>
            <li>
                Category:{' '}
                <input
                    type="number"
                    value={this.case.category}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                        if (this.case) this.case.category = event.target.value;
                    }}
                />
            </li>
            <li>
                Importance:{' '}
                <input
                    type="number"
                    value={this.case.importance}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                        if (this.case) this.case.importance = event.target.value;
                    }}
                />
            </li>
        </ul>
        <button type="button" onClick={this.save}>
          Save
        </button>
      </form>
    );
  }

  mounted() {
    caseService
      .getCase(this.props.match.params.id)
      .then(casex => (this.case = casex))
      .catch((error: Error) => Alert.danger(error.message));
  }

  save() {
    if (!this.case) return null;

    caseService
      .updateCase(this.case)
      .then(() => {
        let caseList = CaseList.instance();
        if (caseList) caseList.mounted(); // Update Caselist-component
        if (this.case) history.push('/cases/' + this.case.id);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class CasetAdd extends Component {
    title = '';
    text = '';
    img = '';
    category = 0;
    importance = 0;

    render() {
        return (
            <Card title="New Case">
                <form>
                    <ListGroup>
                        <ListGroup.Item>
                            Title:{' '}
                            <input
                                type="text"
                                value={this.title}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Text:{' '}
                            <input
                                type="text"
                                value={this.text}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.text = event.target.value)}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Image link:{' '}
                            <input
                                type="text"
                                value={this.img}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.img = event.target.value)}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Category:{' '}
                            <input
                                type="number"
                                value={this.number}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.number = event.target.value)}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Importance:{' '}
                            <input
                                type="number"
                                value={this.importance}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.importance = event.target.value)}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button.Success onClick={this.save}>Register</Button.Success>
                            <Button.Danger onClick={this.discard}>Discard</Button.Danger>
                        </ListGroup.Item>
                    </ListGroup>
                </form>
            </Card>
        );
    }

    discard() {
        history.push('/');
    }

    save() {
        if (!this.case) return null;

        caseService
            .createCase(this.title, this.text, this.img, this.category, this.importance)
            .then(() => {
                let caseList = CaseList.instance();
                if (caseList) caseList.mounted(); // Update Caselist-component
                if (this.case) history.push('/cases/' + this.case.id);
            })
            .catch((error: Error) => Alert.danger(error.message));
    }
}


const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/cases" component={CasetAdd} />
        <Route exact path="/cases/:id" component={CaseDetails} />
        <Route exact path="/cases/:id/edit" component={CaseEdit} />
      </div>
    </HashRouter>,
    root
  );
