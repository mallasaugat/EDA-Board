import React, { Component } from 'react'

import { ReadCSV } from './components/ReadCSV';
import Paginate from './components/Paginate';

import './App.css'

export class App extends Component{


  render(){

    return(
      <>
        <ReadCSV/>
      </>
    )

  }

}

export default App;