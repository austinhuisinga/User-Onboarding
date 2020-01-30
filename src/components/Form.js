import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// add *at least* name, email, password, TOS, submit button
const OnboardForm = ({ values, errors, touched, status }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    console.log('status has changed', status);
    status && setUsers( user => [...users, status])
  }, [status]);
  return(
    <div className='user-form'>
      <Form>
        <label htmlFor='name'>Name:</label>
        <Field id='name' name='name' type='text' placeholder='Name' />
        {touched.name && errors.name && (
          <p className='errors'>
            {errors.name}
          </p>
        )}

        <label htmlFor='email'>Email:</label>
        <Field id='email' name='email' type='text' placeholder='Email' />
          {touched.email && errors.email && (
            <p className='errors'>
              {errors.email}
            </p>
          )}

        <label htmlFor='name'>Password:</label>
        <Field id='password' name='password' type='password' placeholder ='Password' />
          {touched.password && errors.password && (
              <p className='errors'>
                {errors.password}
              </p>
            )}

        <label className='tos-checkbox' htmlFor='tos'>I have read and understand the Terms of Service</label>
        <Field id='tos' name='tos' type='checkbox' checked={values.tos} />
       
        <button type='submit'>Submit</button>
      </Form>
      {users.map(user => (
        <ul key={user.id}>
          <li>Name: {user.name}</li>
          <li>Email: {user.email}</li>
          <li>Password: {user.password}</li>
        </ul>
      ))}
    </div>
  );
};

const FormikOnboardForm = withFormik({
  mapPropsToValues(props) {
    return {
      name: props.name || '',
      email: props.email || '',
      password: props.password || '',
      tos: props.tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required('You need a name!')
      .min(3, 'Name must be at least 3 characters long'),
    email: Yup.string()
      .required('Email is required')
      .email('Not a valid email address'),
    password: Yup.string()
      .required('You need a password!')
      .min(8, 'Password is too weak'),
    tos: Yup.boolean(true)
      .required('You must accept the Terms of Service')
  }),
  handleSubmit(values, { setStatus }){
    console.log('submitting', values);
    axios.post(`https://reqres.in/api/users`, values)
    .then(res => {
      console.log('success', res);
      setStatus(res.data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
})(OnboardForm);
export default FormikOnboardForm;