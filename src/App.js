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
  username:''
}

function App() {
    
    const [formState, updateFormState] = useState(initialFormState)
    const loginState = useState(initialLoginState)

    function onChange(e){
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]:e.target.value}))
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
        updateFormState(() => ({...formState, formType:'signedIn'}))
        updateFormState(() => ({...loginState, username:username}))
    }

    async function goToSignUp(){
      updateFormState(() => ({...formState, formType:'signUp'}))
    }


    return (
        <div className="App">
            {
                formType === 'signUp' && (
                    <div>
                        <input name='username' onChange={ onChange } placeholder='username'/>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/>
                        <input name='name' onChange={ onChange } placeholder='name'/>
                        <input name='address' onChange={ onChange } placeholder='address'/>
                        <p>Select your Farm Type</p>
                        <input name='farm_type' type='radio' id='html1' value='indoor' onChange={ onChange } placeholder='farm_type'/>
                        <label for="html1">Indoor</label><br></br>

                        <input name='farm_type' type='radio' id='html2' value='outdoor'onChange={ onChange } placeholder='farm_type'/>
                        <label for="html2">Outdoor</label><br></br>

                        <input name='phone_number' onChange={ onChange } placeholder='phone_number'/>
                        <button onClick={signUp}>Sign Up</button>
                        

                    </div>
                )
            }

            {
                formType === 'signIn' && (
                    <div>
                        <input name='username' onChange={ onChange } placeholder='username'/>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/>
                        <button onClick={signIn}>Sign In</button>
                        <br></br>
                        <button onClick={goToSignUp}>Click here to Sign Up</button> 

                    </div>
                )
            }


            {
                formType === 'confirmSignUp' && (
                    <div>
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


            


        </div>
    )
}

export default App;