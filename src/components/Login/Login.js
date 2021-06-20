import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import AuthContext from '../../store/auth-context';


const emailReducer = (state, action) => {

  if (action.type === 'USER_INPUT') {
    return { 
      value: action.val, 
      isValid: action.val.includes('@') 
    };
  }

  if (action.type === 'INPUT_BLUR') {
    return { 
      value: state.value,
      isValid: state.value.includes('@')
    }
  }

  return {
    value: '',
    isValid: false
  }

};

const passwordReducer = (state, action) => {

  if (action.type === 'USER_INPUT') {
    return { 
      value: action.val, 
      isValid: action.val.trim().length > 6
    };
  }

  if (action.type === 'INPUT_BLUR') {
    return { 
      value: state.value,
      isValid: state.value.trim().length > 6
    }
  }

  return {
    value: '',
    isValid: false
  }

};

function Login() {

  const [formIsValid, setFormIsValid] = useState(false);
  const ctx = useContext(AuthContext);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: undefined
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: undefined
  });

  const { isValid: isEmailValid } = emailState;
  const { isValid: isPassValid } = passwordState;

  useEffect(() => {

    const identifier = setTimeout(() => {
      console.log('Checking form validity');
      setFormIsValid(isEmailValid && isPassValid);
    }, 500);

    return () => {
      console.log('Clean up function');
      clearTimeout(identifier);
    };
  }, [isEmailValid, isPassValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          isValid={isEmailValid}
          value={emailState.value}
          id="email"
          type="email"
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        >
          E-mail
        </Input>
        <Input
          isValid={isPassValid}
          value={passwordState.value}
          id="password"
          type="password"
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        >
          Password
        </Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
