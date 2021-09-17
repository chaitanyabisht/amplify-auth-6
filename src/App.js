import Amplify from 'aws-amplify';
import config from './aws-exports';

import React , { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';

Amplify.configure(config)

const initialFormState = {
    username:'', password:'',name:'',phone_number:'',address:'',farm_type:'',authCode:'',formType:'signIn'
}

const initialLoginState = {
  username:'',password:''
}

function App() {
    
    const [formState, updateFormState] = useState(initialFormState)
    const [loginState,updateLoginState] = useState(initialLoginState)

    function onChange(e){
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]:e.target.value}))
        updateLoginState(() => ({...loginState, [e.target.name]:e.target.value}))
    }

    const { formType } = formState

    async function signUp(){
        const {username, password, name,phone_number, address, farm_type} = formState
        await Auth.signUp({username,password,attributes:{phone_number,name,address,'custom:farm_type':farm_type}})
        updateFormState(() => ({...formState, formType:'confirmSignUp'}))
    }

    async function confirmSignUp(){
        const { username, authCode } = formState
        await Auth.confirmSignUp(username,authCode)
        updateFormState(() => ({...formState, formType:'signIn'}))
    }

    async function signIn(){
        const { username, password } = formState
        await Auth.signIn(username,password)
        updateFormState(() => ({...loginState, username:username}))
        updateFormState(() => ({...formState, formType:'signedIn'}))
        
    }

    async function goToSignUp(){
      updateFormState(() => ({...formState, formType:'signUp'}))
    }


    return (
        <div className="App">
            {
                formType === 'signUp' && (
                    <div>
                        <h1>Sign Up Page</h1>
                        <input name='username' onChange={ onChange } placeholder='username'/><br></br><br></br>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/><br></br><br></br>
                        <input name='name' onChange={ onChange } placeholder='name'/><br></br><br></br>
                        <input name='address' onChange={ onChange } placeholder='address'/><br></br><br></br>
                        <p>Select your Farm Type</p>
                        <input name='farm_type' type='radio' id='html1' value='indoor' onChange={ onChange } placeholder='farm_type'/>
                        <label for="html1">Indoor</label><br></br>

                        <input name='farm_type' type='radio' id='html2' value='outdoor'onChange={ onChange } placeholder='farm_type'/>
                        <label for="html2">Outdoor</label><br></br>

                        <br></br>

                        <input name='phone_number' onChange={ onChange } placeholder='phone_number'/>
                        <br></br>
                        <br></br>
                        <button onClick={signUp}>Sign Up</button>
                        

                    </div>
                )
            }

            {
                formType === 'signIn' && (
                    <div className='form'>
                        <h1>Sign In Page</h1><br></br>
                        <input name='username' onChange={ onChange } placeholder='username'/><br></br><br></br>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/><br></br><br></br>
                        <button className='button' onClick={signIn}><span>Sign In</span></button>
                        <br></br><br></br>
                        <button className='button' onClick={goToSignUp}><span>Click here to Sign Up</span></button> 

                    </div>
                )
            }


            {
                formType === 'confirmSignUp' && (
                    <div>
                        <h1>Enter Authentication Code</h1>
                        <input name='authCode' onChange={ onChange } placeholder='authCode'/>
                        <button onClick={confirmSignUp}>Verify</button>

                    </div>
                )
            }


            {
                formType === 'signedIn' && (
                    <div>
                        <h1>Welcome to Cosmosnets, {loginState.username}</h1>
                    </div>
                )
            }

                        {
                formType === 'regIn' && (
                    <div>
                        <input name='country_code' onChange={ onChange } placeholder='Country Code'/>
                        <input name='region_code' onChange={ onChange } placeholder='Region Code'/>
                        <input name='farm_size' onChange={ onChange } placeholder='Farm Size'/>
                        <input name='plant_type' onChange={ onChange } placeholder='Plant Types to be monitored'/>
                        <input name='other_things' onChange={ onChange } placeholder='Other Things'/>
                        <input name='drone_robot_count' onChange={ onChange } placeholder='Number of Drones and Robots to be needed'/>
                        <input name='waypoints' onChange={ onChange } placeholder='Waypoints'/>
                        <input name='data_freq' onChange={ onChange } placeholder='Frequency of Data Monotoring'/>
                        
                        <button onClick={signIn}>Sign In</button>
                        <br></br>
                        <button onClick={goToSignUp}>Click here to Sign Up</button> 

                    </div>
                )
            }

        </div>
    )
}

export default App;