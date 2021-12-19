import { Amplify, Hub } from 'aws-amplify';
import config from './aws-exports';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import React , { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { func } from 'prop-types';

Amplify.configure(config)

const initialFormState = {
    username:'', password:'',name:'',phone_number:'+919999999999',address:'',farm_type:'',farm_location:'TBS',farm_id:'TBS',plant_types:'TBS',
    other_types:'TBS',drone_qty:'TBS',waypoints_qty:'TBS',data_monitor_qty:'TBS',reg_complete:'false'
    
    ,authCode:'',OTP:'',formType:'signIn',new_password:''
}


function App() {
    
    const [formState, updateFormState] = useState(initialFormState)

    const [user, updateUser] = useState(null)
    const [value, setValue] = useState()

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
            console.log('User not signed in')
        }
    }

    function onChange(e){
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]:e.target.value}))
    }

    const { formType } = formState

    async function signUp(){
        const {username, password, name,phone_number, address, farm_type,farm_location,farm_id,plant_types,other_types,drone_qty,waypoints_qty,data_monitor_qty} = formState
        await Auth.signUp({username,password,attributes:{phone_number,name,address,'custom:farm_type':farm_type,'custom:farm_location':farm_location,'custom:farm_id':farm_id,'custom:plant_types':plant_types,'custom:other_types':other_types,'custom:drone_qty':drone_qty,'custom:waypoints_qty':waypoints_qty,'custom:data_monitor_qty':data_monitor_qty,'custom:reg_complete':'false'}})
        updateFormState(() => ({...formState, formType:'confirmSignUp'}))
    }

    async function confirmSignUp(){
        const { username,password,authCode } = formState
        await Auth.confirmSignUp(username,authCode)
        await Auth.signIn(username,password)
        //await Auth.verifyCurrentUserAttribute('phone_number')
        updateFormState(() => ({...formState, formType:'regIn'}))   //CHANGE IT BACK TO verifyPhone
    }

    async function verifyPhone(){
        const {username, password,OTP} = formState
        await Auth.signIn(username,password)
        console.log(OTP)
        await Auth.verifyCurrentUserAttributeSubmit('phone_number',OTP)
        updateFormState(() => ({...formState, formType:'regIn'}))
    }

    async function signIn(){
        const { username, password } = formState
        const user = await Auth.signIn(username,password)
        if (user['attributes']['custom:reg_complete'] === 'true'){
            updateFormState(() => ({...formState, formType:'signedIn'}))
        }else{
            updateFormState(() => ({...formState, formType:'regIn'}))
            console.log(user)
        }

    }

    async function goToSignUp(){
      updateFormState(() => ({...formState, formType:'signUp'}))
    }

    async function regIn(){
        const {username,password,farm_type,farm_location,farm_id,plant_types,other_types,drone_qty,waypoints_qty,data_monitor_qty,reg_complete} = formState;
        await Auth.signIn(username,password);
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user,{'custom:farm_type':farm_type,'custom:farm_location':farm_location,'custom:plant_types':plant_types,'custom:other_types':other_types,'custom:drone_qty':drone_qty,'custom:waypoints_qty':waypoints_qty,'custom:data_monitor_qty':data_monitor_qty,'custom:reg_complete':'true'});
        updateFormState(() => ({...formState, formType:'signedIn',reg_complete:'true'}))
    }

    async function goToUpdateDetails(){
        updateFormState(() => ({...formState, formType:'updateDetails'}))
    }

    async function updateDetails(){
        const {new_password,password} = formState
        const user = await Auth.currentAuthenticatedUser();
        await Auth.changePassword(user,password,new_password);
        updateFormState(() => ({...formState, formType:'signIn'}))
    }

    console.log(formState.formType)
    console.log(formState.phone_number)
    return (
        <div className="App">
            {
                formType === 'signUp' && (
                    <div className='form'>
                        <h1 className='signIn'>Sign Up Page</h1>
                        <input name='username' onChange={ onChange } placeholder='username'/><br></br><br></br>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/><br></br><br></br>
                        <input name='name' onChange={ onChange } placeholder='name'/><br></br><br></br>
                        <input name='address' onChange={ onChange } placeholder='address'/><br></br><br></br>
                        <p align='left'>Select your Farm Type</p>
                        <div className='radio'>
                        <input name='farm_type' type='radio' id='html1' value='indoor' onChange={ onChange } placeholder='farm_type'/>
                        <label for="html1">Indoor</label>
                        <input name='farm_type' type='radio' id='html2' value='outdoor'onChange={ onChange } placeholder='farm_type'/>
                        <label for="html2">Outdoor</label><br></br>
                        </div>
                        
                        <br></br>

                        <PhoneInput placeholder="Enter phone number" value={value} onChange={ setValue } />

                        <br></br>
                        <br></br>
                        <button onClick={signUp}>Sign Up</button>
                        

                    </div>
                )
            }

            {
                formType === 'signIn' && (
                    <div className='form'>
                        <h1 className='signIn'>Sign In Page</h1><br></br>
                        <input name='username' onChange={ onChange } placeholder='Email'/><br></br><br></br>
                        <input name='password' type='password' onChange={ onChange } placeholder='Password'/><br></br><br></br>
                        <button className='button' onClick={signIn}><span>Sign In</span></button>
                        <br></br><br></br>
                        <a className='link' onClick={goToSignUp}><span>Click here to Sign Up</span></a>
                        <br></br>

                    </div>
                )
            }


            {
                formType === 'confirmSignUp' && (
                    <div className='form'>
                        <h1 className='signIn'>Enter Authentication Code sent to your email</h1>
                        <input name='authCode' onChange={ onChange } placeholder='authCode'/>
                        <button onClick={confirmSignUp}>Verify</button>

                    </div>
                )
            }
            
            {
                formType === 'verifyPhone' && (
                    <div className='form'>
                        <h1 className='signIn'>Enter Authentication Code sent to your Phone</h1>
                        <input name='OTP' onChange={ onChange } placeholder='OTP'/>
                        <button onClick={verifyPhone}>Verify</button>

                    </div>
                )
            }

            {
                formType === 'signedIn' && (
                    <div className='form'>
                        <h1 className='signIn'>Welcome to Cosmosnets, {user['attributes']['name']}</h1>
                        <br></br>
                        <button onClick = {
                            () => Auth.signOut()
                        }>Sign Out</button>
                        <br></br><br></br>
                        <a className='link' onClick={goToUpdateDetails}><span>Update Details</span></a>
                    </div>
                )
            }

                        {
                formType === 'regIn' && (
                    <div className='form'>
                        {/* <input name='country_code' onChange={ onChange } placeholder='Country Code'/>
                        <input name='region_code' onChange={ onChange } placeholder='Region Code'/>
                        <input name='company_name' onChange={ onChange } placeholder='Company Name'/> */}
                        <h1 className='signIn'>Please enter the following details to complete registration</h1><br></br>
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
            {
                formType === 'updateDetails' && (
                    <div className='form'>
                        <h1 className='signIn'>Update Details</h1>
                        {/* <h2>Leave the field blank if you don't want to update that</h2> */}
                        <br></br>  
                        <input name='password' onChange={ onChange } type='password' placeholder='Enter Old Password'/>
                        <input name='new_password' onChange={ onChange } type='password' placeholder='Enter New Password'/>
                        <button onClick={updateDetails}>Update</button>
                        {/* type='password' */}
                    </div>
                )
            }
        

        </div>
    )
}

export default App;