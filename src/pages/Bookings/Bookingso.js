import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import { withFirebase } from 'firekit-provider'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table';
import firestore from 'firebase/firestore'
import Typography from '@material-ui/core/Typography'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Manager, Reference, Popper } from 'react-popper';
import {DateFormatInput} from 'material-ui-next-pickers'


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
        <Button color={selected?'primary':'inherit'} disabled={avail}
                onClick={() => { this.toggleState({selected:true}) }} >{this.col?'Court 2':'Court 1'}</Button>
    )
  } 

}

class YourComponent extends React.Component {
  onChangeDate = (date:Date) => {

    this.setState({date})
  } 


 constructor(props) {
    super(props);
    this.state = {date:false }
    this.setState = this.setState.bind(this);
    }
  render() {
    const {date} = this.state
    
    return (
      <div >
        <DateFormatInput name='date-input' value={date} onChange={this.onChangeDate} />
	
      </div>

    )
  } 
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(time, t00, t30 , b00 , b30) {
  id += 1;
  return { id,time, t00, t30 , b00 , b30};
}

const rows = [
  createData('8 AM', 0, 0 ,0,0),
  createData('9 AM', 0, 0 ,0,0),
  createData('10 AM', 0, 0 ,0,0),
  createData('11 AM', 305, 0 , 1 , 0),
  createData('12 AM', 356, 0, 1 , 0),
  createData('1 PM', 356, 0, 1 , 0),
  createData('2 PM', 0, 16.0 ,0 ,2),
  createData('3 PM', 356, 16.0 , 1 , 2),
  createData('3 PM', 356, 0 ,2, 0),
  createData('5 PM', 0, 16.0 ,0 , 1),
  createData('6 PM', 356, 0 , 1 , 0),
  createData('7 PM', 0, 16.0 , 0 , 2),
  createData('8 PM', 356, 0 , 2, 0),
  createData('9 PM', 356, 16.0 , 1 , 2),
  createData('10 PM', 0, 0 ,0,0),
  createData('11 PM',0, 0,0,0),
];

function SimpleTable(props) {
  const { classes } = props;
  onSave = () =>
  {
 
    const { firebaseApp } = this.props

    let firestore = firebaseApp.firestore()

    const docRef = firestore.doc('samples/sandwichData')

    docRef.set({
      hotDogStatus: this.state.value
    })
  
  }
  return (

    <Paper className={classes.root}>
	<Manager>


    <Reference>
      {({ ref }) => (
        <button disabled='true' ref={ref}>
          Choose Date
        </button>
      )}
    </Reference>
    <Popper placement="right">
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          <span><YourComponent ></YourComponent></span>
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  </Manager>
	
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell binary>00 - 30</TableCell>
            <TableCell binary>30 - 00</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.time}
                </TableCell>
                <TableCell binary>
			<Available availa={row.t00} id={{row:row.time,col:0}}/>
			<Available availa={row.b00===2} id={{row:row.time,col:1}}/>
		</TableCell>
                <TableCell binary>
			<Available availa={row.t30} id={{row:row.time,col:0}}/>
			<Available availa={row.b30===2} id={{row:row.time,col:1}}/>
		</TableCell>
              
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
 <Button onClick={() => { onSave() }}>Save Bookings </Button>
    </Paper>

   
  );
}

SimpleTable.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  const { docs, initialization } = state;

  const bookings = docs['bookings/sandwichData'] ? docs['bookings/sandwichData'] : {}

  return {
    sandwichData,
  };
};

export default connect(
  mapStateToProps, {}
)(injectIntl(withFirebase(SimpleTable)));
