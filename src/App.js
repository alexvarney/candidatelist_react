import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Candidates from './Candidates'
import PolicyList from './Policies'

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      candidates: Candidates,
      searchValue: '',
      policyList: PolicyList,
    }

  }

  onSearchChange = (e) =>{
    this.setState({searchValue: e.target.value});

  }

  render() {

    const newList = this.state.candidates.filter((item)=>item.name.toLowerCase().includes(this.state.searchValue.toLowerCase()));

    return (
      <div className="App">
        <h1>Welcome to CandidateList</h1>
        <Input value={this.state.searchValue} onInputChange={this.onSearchChange} placeholder={"Search"}/>
        <h2>Declared</h2>
        <CandidateTable 
          list={newList.sort((a,b)=>a.polling > b.polling ? -1 : 1)} 
          statusName={'declared'}
          policies={this.state.policyList}/>

        <h2>Potential</h2>
        <CandidateTable 
          list={newList} 
          statusName={'undeclared'}
          policies={this.state.policyList}
          />

        <h2>Dropped</h2>
        <CandidateTable 
          list={newList} 
          statusName={'dropped'}
          policies={this.state.policyList}
          />
      </div>
    )
  }
}

const CandidateTable = ({list, statusName, policies}) =>
{
  const makeStatusFilter = (item) => (statusName === '*') ? true : item.status === statusName;
  const renderList = list.filter(makeStatusFilter);

  return (renderList.length > 0) 
    ? <div className="candidateTable">
        {renderList.map(candidate => {
          return <CandidateCell candidate={candidate}> 
            <PolicyTable candidate={candidate} policies={policies}></PolicyTable>
          </CandidateCell>})}
      </div> 
    : <p style={{textAlign: 'center'}}>No candidates found.</p>;
}

const Input = ({value, onInputChange, placeholder}) => {
  return(
    <form className="inputForm">
      <input type="text" 
        value={value} 
        onChange={onInputChange}
        placeholder={placeholder}></input>
    </form>
  )
}

const CandidateCell = ({candidate, children}) => {
  return(
    <div key={candidate.id} className="table-row flex-parent">
      <div>
        <img className="candidate-image" alt={'the face of ' + candidate.name} src={(candidate.headshotImage) ? `headshots/${candidate.headshotImage}`: 'https://via.placeholder.com/150'}></img>
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
        <div>
          {children}
        </div>
      </div>
    </div>
)
}

const PolicyTable = ({candidate, policies}) => {
  return(
    <div className="policy-block">
      <h3>Positions:</h3>
      {policies.map((policy)=>
        <div>
        {policy.positions.filter((position)=> position.name === candidate.id && position.status !== 'none').map((position)=>
          <div>
            <p><strong>{policy.display}</strong><span className={`text-position-${position.status}`}>{position.status}</span></p>
            <p>{position.description}</p>
          </div>
        )}
        </div>
      )}
    </div>
  )
}