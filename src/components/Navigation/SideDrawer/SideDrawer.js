import React from 'react';

import classes from './SideDrawer.css'

import Logo from './../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import BackDrop from './../../UI/BackDrop/BackDrop';
import Aux from '../../../hoc/Aux/Aux'

const sideDrawer = (props) => {
  const attachedClasses = [classes.SideDrawer];
  if (props.open){
    attachedClasses.push(classes.Open)
  } else {
    attachedClasses.push(classes.Close);
  }
  
  return (
    <Aux>
      <BackDrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')}>
        <div className={classes.Logo}><Logo /></div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </Aux>
  );
};

export default sideDrawer;