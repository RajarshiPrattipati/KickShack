import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { Activity } from 'rmw-shell'
import Button from '@material-ui/core/Button'
import { withFirebase } from 'firekit-provider'
// eslint-disable-next-line
import firestore from 'firebase/firestore'
import { Manager, Reference, Popper } from 'react-popper';
import {DateFormatInput} from 'material-ui-next-pickers'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

var gdate = new Date().toDateString();



 const columns = [{
    Header: 'Time',
    accessor: 'time' // String-based value accessors!
  }, {
    Header: 'xx:00 - xx:30',
    columns: [{
        Header: 'Court 1',
        accessor: 't01',
        Cell : row => ( <Available availa={row.value} id={{row:row.value,col:0} }/>)
      }, {
        Header: 'Court2',
        accessor: 't02',
	Cell : row => ( <Available availa={row.value} id={{row:row.value,col:0}}/>)
      }],
    
  }, {
    Header: 'xx:30 - xx:00', 
   columns: [{
             Header: 'Court 1',
        accessor: 't31', 
	Cell : row => ( <Available availa={row.value} id={{row:row.value,col:0}}/>)
      }, {
        Header: 'Court2',
	accessor: 't32',
	Cell : row => ( <Available availa={row.value} id={{row:row.value,col:0}}/>)
      }],
    
  }]




class Available extends React.Component {

    constructor(props) {
	    super(props);
	    this.state = {avail:this.props.availa , selected:false}
	    this.id = this.props.id.row
	    this.col = this.props.id.col
	    this.setState = this.setState.bind(this);
    }
 toggleState = () => {
	if(this.state.selected === true)
		this.setState({selected:false})
	else
		this.setState({selected:true})

}
  render() {
    const {avail,selected} = this.state	
    
    return (
        <Button color={selected?'primary':'inherit'} disabled={avail===0?true:false}
                onClick={() => { this.toggleState({selected:true}) }} >{avail?'Available':'Booked'}</Button>
    )
  } 

}


class YourComponent extends React.Component {


  onChangeDate = (date:Date) => {
   
    let datestr = date.toDateString()
    //this.setState({datestr})
    this.props.refresh(datestr)
  } 


 constructor(props) {
    super(props);
    this.state = this.props.date
    this.setState = this.setState.bind(this);
    this.today = new Date().toDateString()
	
    }
  render() {
    const {date} = this.state 	
    
    return (
      <div >
        <DateFormatInput name='date-input' value={date} onChange={this.onChangeDate} min={new Date()}/>
	
      </div>

    )
  } 
}

class Bookings extends Component {

  constructor(props) {
    let data = []
    super(props);
	
	
    this.state = {
	  
      bookings: data,
      date : new Date().toDateString()
    };
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentWillMount() {
 /*   let data = [
  {time:'8 AM', t01:0 , t02:1 , t31:0 , t32:0},
  {time:'9 AM', t01:1 , t02:1 , t31:0 , t32:'0'},
  {time:'10 AM', t01:0 , t02:1 , t31:1 , t32:0},
  {time:'11 AM', t01:0 , t02:0 , t31:0 , t32:0},
  {time:'12 PM', t01:1 , t02:0 , t31:0 , t32:0},
  {time:'1 PM', t01:0 , t02:0, t31:0 , t32:1},
  {time:'2 PM', t01:0 , t02:1 , t31:0 , t32:0},
  {time:'3 PM', t01:1 , t02:0 , t31:1 , t32:0},
  {time:'4 PM', t01:0 , t02:0 , t31:0 , t32:0},
  {time:'5 PM', t01:0 , t02:1 , t31:0 , t32:0},
  {time:'6 PM', t01:1 , t02:0 , t31:1 , t32:0},
  {time:'7 PM', t01:0 , t02:1 , t31:0 , t32:0},
  {time:'8 PM', t01:0 , t02:1 , t31:0 , t32:0},
  {time:'9 PM', t01:0 , t02:1 , t31:1 , t32:0},
  {time:'10 PM', t01:0 , t02:0 , t31:0 , t32:0},
  {time:'11 PM', t01:1 , t02:0 , t31:0 , t32:0},

];
  
  this.setState({bookings:data})
*/
	let data = []
	const { firebaseApp } = this.props
	let firestore = firebaseApp.firestore()
	console.log('Gdate ' , gdate)
	const docRef = firestore.collection('bookings').doc(gdate)
	docRef.get().then(function(doc) {
		data.push( doc.data().bookings)
	  });
	this.setState({bookings:data})
       
  }

  componentWillUnmount() {
    //this.handleUnwatch()
  }

  handleSave = () => {
    const { firebaseApp } = this.props

    let firestore = firebaseApp.firestore()

    const docRef = firestore.doc('bookings/'+this.state.date)
	
    docRef.set({
      bookings: this.state.bookings[0]
    })
  }
  handleRefresh (date){
	
	const { firebaseApp } = this.props
	let firestore = firebaseApp.firestore()
	this.setState({date:date})
	setTimeout(function() { //Start the timer
      	this.setState({render: true}) //After 1 second, set render to true
 	 }.bind(this), 2000)	
    	const docRef = firestore.collection('bookings').doc(date)
	docRef.get().then((doc)	=> {
	  
	    if (doc.exists) {
		
		let data = []
		docRef.get().then(function(doc) {
		data.push( doc.data().bookings)
	 	 });
		
		this.setState({bookings:data})
		console.log(" gone? data:", this.state);
		
	    } else {
		let data = [
		  {time:'8 AM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'9 AM', t01:1 , t02:1, t31:1, t32:1},
		  {time:'10 AM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'11 AM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'12 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'1 PM', t01:1 , t02:1, t31:1 , t32:1},
		  {time:'2 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'3 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'4 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'5 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'6 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'7 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'8 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'9 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'10 PM', t01:1 , t02:1 , t31:1 , t32:1},
		  {time:'11 PM', t01:1 , t02:1 , t31:1 , t32:1},

		];
		  console.log("New Data : ",data)
		docRef.set({
    		  bookings: data
   		 })
		data = []
		docRef.get().then(function(doc) {
		data.push( doc.data().bookings)
	 	 });
		
		this.setState({bookings:data})
		console.log(" gone? data:", this.state);
		
		  this.setState({bookings:data})
		console.log("No such document!");
	    }
	}).catch(function(error) {
	

	    console.log("Error getting document:", error);
		
	});
	
	
  
  }



  render() {
    const { intl, bookings, isWatching } = this.props
	const wellStyles = { maxWidth: 400, margin: '20px auto 20px' };
    return (
      <Activity title={intl.formatMessage({ id: 'Bookings' })}>

	<div className="well" style={wellStyles}>
	<Manager>

	    <Reference>
	      {({ ref }) => (
		<label disabled='true' ref={ref}>
		  Choose Date
		</label>

	      )}
	    </Reference>
	    <Popper placement="right">
	      {({ ref, style, placement, arrowProps }) => (
		<div ref={ref} style={style} data-placement={placement}>
		  <span><YourComponent date={this.state.date} refresh={this.handleRefresh}></YourComponent ></span>
		  <div ref={arrowProps.ref} style={arrowProps.style} />
		</div>
	      )}
	    </Popper>
 	</Manager>
	</div>
	<ReactTable
    data={this.state.bookings[0]}
    columns={columns}
    sortable={false}
    defaultPageSize = '8'
    showPageSizeOptions= {false}
    previousText= 'Morning'
    nextText= 'Evening'>

    {(state, makeTable, instance) => {
    return (
      <div
        style={{
          background: "#C1D327",
          borderRadius: "5px",
          overflow: "hidden",
          padding: "5px"
        }}
      >

        {makeTable()}
      </div>
    );
  }}
</ReactTable>
	<div>
		
 		<Button style={{width:'100%' , height:'60px'}} onClick = { this.handleSave } >Save Booking </Button>
	</div>
      </Activity>
    );

  }
}

Bookings.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  const { docs, initialization } = state;
  const bookings = docs['bookings/'+gdate] ? docs['bookings/'+gdate] : {}
  const isWatching = new Date().toDateString()
  return {
    bookings,
    isWatching
  };
};

export default connect(
  mapStateToProps, {}
)(injectIntl(withFirebase(Bookings)));
