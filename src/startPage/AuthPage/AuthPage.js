import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { CustomField } from './../../common/common';
import {
  INITIAL_VALUES, SIGNUP_SCHEMA, MASKS,
  LABEL_PLACEHOLDERS, API_AUTH_ADMIN,
  API_AUTH_CLIENT
} from './constants';

import { useNavigate } from 'react-router';
import { connect } from 'react-redux';
import './AuthPage.css';
import { IP_ADDRESS } from '../../App/App';
import { authenticate } from '../../services/authenticate';
import { setAccountId } from '../../actions/actions';
import { bindActionCreators } from 'redux';

//Два варианта поведения системы, всё зависит от вопроса кто перед нами админ или пользователь.
//Узнаем кто перед нами в зависимости от кнопки по которой перешёл человек, отметка о том, админ
//Или нет хранится в isAdminAuth в redux. После того как узнали, отправляем запрос на разные api

function AuthPage({ isAdminAuth, setAccountId }) {
  let navigate = useNavigate();
  const IP = useContext(IP_ADDRESS);

  const handleSwitchForm = (isAuthSuccess, id) => {
    if (!isAuthSuccess) {
      alert('Неверный логин или пароль')
    } else {
      setAccountId(id);
      if (isAdminAuth) {
        navigate('admin');
      } else {
        navigate('client')
      }
    }
  }
  const handleComeBack = () => {
    navigate(-1)
  }
  const handleSubmit = async (values) => {
    if (isAdminAuth) {
      let { ok, id } = await authenticate(IP, values, API_AUTH_ADMIN,);
      handleSwitchForm(ok, id);
    } else {
      let { ok, id } = await authenticate(IP, values, API_AUTH_CLIENT);
      handleSwitchForm(ok, id);
    }
  }

  return (
    <div className='auth-page'>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        validationSchema={SIGNUP_SCHEMA}
      >
        {({ errors, touched }) => (
          <Form className='form'>
            {Object.keys(INITIAL_VALUES).map((value, index) => {
              return (
                <CustomField
                  key={`form__input${index}2`}
                  errors={errors}
                  touched={touched}
                  value={value}
                  indexInitialValue={index}
                  LABEL_PLACEHOLDERS={LABEL_PLACEHOLDERS}
                  INITIAL_VALUES={INITIAL_VALUES}
                  MASKS={MASKS}
                />
              );
            })}
            <button className='form__btn' type='submit'>Войти</button>
            <button onClick={() => handleComeBack(-1)} className='form__btn' type='button'>Назад</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
function mapStateToProps({ isAdminAuth }) {
  return {
    isAdminAuth,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccountId }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
