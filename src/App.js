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
      checkedView: 'candidates',
    }
  }

  onSearchChange = (e) =>{
    this.setState({searchValue: e.target.value});
  }

  onViewChange = (e) => {
    this.setState({checkedView: e, searchValue: ''});
  }

  getCandidateView = () => {
    const newList = this.state.candidates.filter((item)=>item.name.toLowerCase().includes(this.state.searchValue.toLowerCase()));
    return(
      <div className="App">
          <h1>Welcome to CandidateList</h1>
          <ViewControlRadio value={this.state.checkedView} onChecked={this.onViewChange}/>
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

  getPolicyView = () =>
    <div className="App">
      <h1>Welcome to CandidateList</h1>
      <ViewControlRadio value={this.state.checkedView} onChecked={this.onViewChange}/>
      <Input value={this.state.searchValue} onInputChange={this.onSearchChange} placeholder={"Search"}/>
      {PolicyList.filter(i=>i.display.toLowerCase().includes(this.state.searchValue.toLowerCase())).map((item)=> <PolicyExpander key={item.id} policy={item} candidates={this.state.candidates}/>)}
    </div>

  render() {
    return (this.state.checkedView === 'candidates') ? this.getCandidateView() : this.getPolicyView();
  }
}

const CandidateTable = ({list, statusName, policies}) =>
{
  const makeStatusFilter = (item) => (statusName === '*') ? true : item.status === statusName;
  const renderList = list.filter(makeStatusFilter);

  return (renderList.length > 0) 
    ? <div className="candidateTable">
        {renderList.map(candidate => {
          return <CandidateCell key={candidate.id} candidate={candidate}> 
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

const ViewControlRadio = ({value, onChecked}) => {
  return(
    <form className="view-control">
      <div>
        <input type="radio" value="candidates" checked={value === 'candidates'} onChange={() => onChecked('candidates')}/>
        <label onClick={() => onChecked('candidates')} className="radio-label">Candidates</label>
      </div>
      <div>
        <input type="radio" value="policies" checked={value === 'policies'} onChange={() => onChecked('policies')}/>
        <label onClick={() => onChecked('policies')} className="radio-label">Policies</label>
      </div>
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

  const displayTextMap = {
    'for': 'For',
    'mixed': 'Mixed',
    'against': 'Against',
  }

  return(
    <div className="policy-block">
      <h3>Positions:</h3>
      {policies.map((policy)=>
        <div key={policy.id}>
          {policy.positions.filter((position)=> position.name === candidate.id && position.status !== 'none').map((position)=>
            <div key={`${policy.id}-${position.name}`}>
              <p><strong>{policy.display}</strong><span className={`text-position-${position.status}`}>{displayTextMap[position.status]}</span></p>
              <p>{position.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const getCandidateName = (id, candidates) => {
  return candidates.filter((i) => i.id === id)[0].name;
}

const PolicyExpander = ({policy, candidates}) => {
  return(
  <div className="policyExpander">
    <h1>{policy.display}</h1>
    {policy.positions.filter(i=>i.status !== 'none' && i.status !== '').map((position) =>
    <div key={`${policy.id}-${position.name}`}>
      <p><span className="candidate-name">{getCandidateName(position.name, candidates)}</span> <span className={`text-position-${position.status}`}>{position.status}</span></p>
      <p>{position.description}</p>
    </div>
  )}
  </div>
  )
}