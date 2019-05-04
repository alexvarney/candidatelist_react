import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Candidates from './Candidates'


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {candidates: Candidates}

    this.getStatusFilter.bind(this);
  }

  getStatusFilter(status){
    return (item) => item.status === status
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to CandidateList</h1>

        <h2>Declared</h2>
        <CandidateTable list={this.state.candidates.sort((a,b)=>a.polling > b.polling ? -1 : 1)} statusName={'declared'}/>

        <h2>Potential</h2>
        <CandidateTable list={this.state.candidates} statusName={'undeclared'}/>

        <h2>Dropped</h2>
        <CandidateTable list={this.state.candidates} statusName={'dropped'}/>
      </div>
    )
  }
}

const CandidateTable = ({list, statusName}) =>
{

  const makeStatusFilter = (item) => (statusName === '*') ? true : item.status === statusName;

  return(
  <div className="candidateTable">
    {list.filter(makeStatusFilter).map(candidate => 
        <div key={candidate.name} className="table-row flex-parent">
          <div>
            <img className="candidate-image" alt="headshot" src={(candidate.headshotImage) ? `headshots/${candidate.headshotImage}`: 'https://via.placeholder.com/150'}></img>
          </div>
          <div className="candidate-info">
            <div className="candidate-headline flex-parent">
              <span className="headline-left candidate-name">{candidate.name}</span>
              <div className="headline-right">
                <span className="candidate-state">{candidate.state}</span>
                <span className="candidate-polling">{(candidate.polling !== -1) ? `${candidate.polling}%`:''}</span>
              </div>
            </div>
            <div>
              <span className="candidate-slogan">{candidate.campaignSlogan}</span>
            </div>
          </div>
        </div>
      )}
  </div>)
}
