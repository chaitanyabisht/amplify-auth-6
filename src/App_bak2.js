import {Amplify, Hub } from 'aws-amplify';
import config from './aws-exports';

import React , { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';

Amplify.configure(config)

const initialFormState = {
    username:'', password:'',name:'',phone_number:'',address:'',farm_type:'',farm_location:'TBS',farm_id:'TBS',plant_types:'TBS',
    other_types:'TBS',drone_qty:'TBS',waypoints_qty:'TBS',data_monitor_qty:'TBS',reg_complete:'false'
    
    ,authCode:'',formType:'signIn'
}


function App() {
    
    const [formState, updateFormState] = useState(initialFormState)

    const [user, updateUser] = useState(null)

    const disp_name = 'null'
    useEffect(() => {
        checkUser()
        setAuthListner()
    },[])

    async function setAuthListner(){
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
                case 'signOut':
                    console.log('user signed out');
                    updateFormState(() => ({...formState, formType:'signIn'}))
                    break;
                default:
                    break;

            }
          });
    }

    async function checkUser(){
        try {
            const user = await Auth.currentAuthenticatedUser();
            updateUser(user)
            console.log('user',user)
            updateFormState(() => ({...formState, formType:'signedIn'}))
        }catch (err){
            console.log('err')
        }
    }

    function onChange(e){
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]:e.target.value}))
    }

    const { formType } = formState

    async function signUp(){
        const {username, password, name,phone_number, address, farm_type,farm_location,farm_id,plant_types,other_types,drone_qty,waypoints_qty,data_monitor_qty} = formState
        const {user} = await Auth.signUp({username,password,attributes:{phone_number,name,address,'custom:farm_type':farm_type,'custom:farm_location':farm_location,'custom:farm_id':farm_id,'custom:plant_types':plant_types,'custom:other_types':other_types,'custom:drone_qty':drone_qty,'custom:waypoints_qty':waypoints_qty,'custom:data_monitor_qty':data_monitor_qty,'custom:reg_complete':'false'}})
        updateFormState(() => ({...formState, formType:'confirmSignUp'}))
    }

    async function confirmSignUp(){
        const { username, authCode } = formState
        await Auth.confirmSignUp(username,authCode)
        updateFormState(() => ({...formState, formType:'signIn'}))
    }

    async function signIn(){
        const { username, password } = formState
        const user = await Auth.signIn(username,password)
        if (user['attributes']['custom:reg_complete'] === 'false'){
            updateFormState(() => ({...formState, formType:'regIn'}))
        }else{
            updateFormState(() => ({...formState, formType:'signedIn'}))
            console.log(user)
        }

    }

    async function goToSignUp(){
      updateFormState(() => ({...formState, formType:'signUp'}))
    }

    async function regIn(){
        const {farm_type,farm_location,farm_id,plant_types,other_types,drone_qty,waypoints_qty,data_monitor_qty,reg_complete} = formState;
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user,{'custom:farm_type':farm_type,'custom:farm_location':farm_location,'custom:plant_types':plant_types,'custom:other_types':other_types,'custom:drone_qty':drone_qty,'custom:waypoints_qty':waypoints_qty,'custom:data_monitor_qty':data_monitor_qty,'custom:reg_complete':'true'});
        updateFormState(() => ({...formState, formType:'signedIn',reg_complete:'true'}))
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
                        <br></br>
                        {/* <button onClick={() => window.location = 'http://localhost:3001/showDetails'}> Show Details </button> */}

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
                        <h1>Welcome to Cosmosnets, {user['attributes']['name']}</h1>
                        <br></br>
                        <button onClick = {
                            () => Auth.signOut()
                        }>Sign Out</button>
                    </div>
                )
            }

                        {
                formType === 'regIn' && (
                    <div>
                        {/* <input name='country_code' onChange={ onChange } placeholder='Country Code'/>
                        <input name='region_code' onChange={ onChange } placeholder='Region Code'/>
                        <input name='company_name' onChange={ onChange } placeholder='Company Name'/> */}
                        <h1>Please enter the following details to complete registration</h1>
                        <input name='farm_location' onChange={ onChange } placeholder='Farm Location'/>
                        <input name='farm_size' onChange={ onChange } placeholder='Farm Size'/>
                        <input name='plant_type' onChange={ onChange } placeholder='Plant Types to be monitored'/>
                        <input name='other_types' onChange={ onChange } placeholder='Other Things'/>
                        <input name='drone_qty' onChange={ onChange } placeholder='Number of Drones and Robots to be needed'/>
                        <input name='waypoints_qtp' onChange={ onChange } placeholder='Waypoints'/>
                        <input name='data_monitor_qty' onChange={ onChange } placeholder='Frequency of Data Monotoring'/>
                        
                        <button onClick={regIn}>Complete Registration</button>
                        <br></br>

                    </div>
                )
            }

        </div>
    )
}

export default App;