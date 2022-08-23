import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {gql, useQuery} from '@apollo/client';
import {Persons} from './Persons';


const ALL_PERSONS = gql`
  query {
    allPersons {
      id
      name
      phone
      address {
        street
        city
      }
    }
  }
`

function App() {
  const {data, error, loading} = useQuery(ALL_PERSONS);

  if (error) return <span style='color: red'>{error}</span>



  return (
    <div className="App">
      <div>
          <img src={reactLogo} className="logo react" alt="React logo" />
          {loading 
          ? <p>Loading ...</p>
          : <Persons persons={data?.allPersons} />
          }
      </div>
    </div>
  )
}

export default App
