// import React from "react";
// import Amplify from "aws-amplify";
// import awsconfig from "./aws-exports";
// import './App.css'

// import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';


// Amplify.configure(awsconfig);

// const App = () => {
//   return (
//     <AmplifyAuthenticator>
//       <AmplifySignUp
//         slot="sign-up"
//         formFields={[
//           {
//             type: "username",
//             label: "Email",
//             placeholder: "Enter Email",
//             inputProps: { required: true, autocomplete: "email" }
            
//           },

//           {
//             type: "name",
//             label: "Name",
//             placeholder: "Enter Name",
//             inputProps: { required: true, autocomplete: "name" }
//           },

//           {
//             type: "password",
//             label: "Password",
//             placeholder: "Enter Password",
//             inputProps: { required: true, autocomplete: "password" }
//           },
//           {
//             type: "phone_number",
//             label: "Phone Number",
//             placeholder: "Enter Phone Number",
//             inputProps: { required: true, autocomplete: "phone_number" }
//           },

//           {
//             type: "address",
//             label: "Address",
//             placeholder: "Enter Address",
//             inputProps: { required: true, autocomplete: "address" }
//           },
//           {
//             type: "custom:farm_type",
//             label: "Farm Type",
//             placeholder: "Enter Farm Type",
//             inputProps: { required: true }
//           }
//         ]} 
//       />

//       <AmplifySignIn slot="sign-in" formFields={[
//           {
//             type: "username",
//             label: "Email Address",
//             placeholder: "Enter Email Address",
//             inputProps: { required: true, autocomplete: "email" }
            
//           },
//           {
//             type: "password",
//             label: "Password",
//             placeholder: "Enter Password",
//             inputProps: { required: true, autocomplete: "password" }
//           }
//         ]} />

//       <div className="App">
//        <header className="App-header">
//         <h2>Welcome to Cosmosnets</h2>
//         <AmplifySignOut />
//        </header>
//      </div>
    
//     </AmplifyAuthenticator>
    
//   );
// };

// export default App;



// import React, { useEffect, useState } from 'react';
// import './App.css'
// import Amplify, { Auth, Hub } from 'aws-amplify';
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     Hub.listen('auth', ({ payload: { event, data } }) => {
//       switch (event) {
//         case 'signIn':
//         case 'cognitoHostedUI':
//           getUser().then(userData => setUser(userData));
//           break;
//         case 'signOut':
//           setUser(null);
//           break;
//         case 'signIn_failure':
//         case 'cognitoHostedUI_failure':
//           console.log('Sign in failure', data);
//           break;
//       }
//     });

//     getUser().then(userData => setUser(userData));
//   }, []);

//   function getUser() {
//     return Auth.currentAuthenticatedUser()
//       .then(userData => userData)
//       .catch(() => console.log('Not signed in'));
//   }

//   return (
//     <div className="App">
//       <header className = "App-header">
//       <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
//       {user ? (
//         <button className = "button" onClick={() => Auth.signOut()}><span>Sign Out</span></button>
//       ) : (
//         <button className = "button" onClick={() => Auth.federatedSignIn()}><span>Sign In</span></button>
//       )}
//       </header> 
//     </div>
//   );
// }

// export default App;


// import Amplify from 'aws-amplify';
// import config from './aws-exports';

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// import { Auth } from 'aws-amplify';



// Amplify.configure(config);


// function App(props) {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
//       </header>
//     </div>
//   )
// }

// export default App



import Amplify from 'aws-amplify';
import config from './aws-exports';

import React , { useState, useEffect } from 'react';
import './App.css';
import { Auth, HUB } from 'aws-amplify';

Amplify.configure(config)

const initialFormState = {
    username:'', password:'',email:'',authCode:'',formType:'signIn'
}

function App() {
    
    const [formState, updateFormState] = useState(initialFormState)

    function onChange(e){
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]:e.target.value}))
    }

    const { formType } = formState

    async function SignUp(){
        const {username, email, password} = formState
        await Auth.signUp({username,password,attributes:{email}})
        updateFormState(() => ({...formState, formType:'confirmSignUp'}))
    }

    async function confirmSignUp(){
        const { username, authCode } = formState
        await Auth.confirmSignUp(username,authCode)
        updateFormState(() => ({...formState, formType:'SignIn'}))
    }

    async function SignIn(){
        const { username, password } = formState
        await Auth.signIn(username,password)
        updateFormState(() => ({...formState, formType:'signedIn'}))
    }


    return (
        <div className="App">
            {
                formType === 'signUp' && (
                    <div>
                        <input name='username' onChange={ onChange } placeholder='username'/>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/>
                        <input name='email' onChange={ onChange } placeholder='email'/>
                        <button onClick={SignUp}>Sign Up</button>
                        

                    </div>
                )
            }

            {
                formType === 'signIn' && (
                    <div>
                        <input name='username' onChange={ onChange } placeholder='username'/>
                        <input name='password' type='password' onChange={ onChange } placeholder='password'/>
                        <button onClick={SignIn}>Sign In</button>

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
                        <h1>Welcome to Cosmosnets</h1>
                    </div>
                )
            }


            


        </div>
    )
}

export default App;