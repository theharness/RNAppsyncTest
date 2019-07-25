/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, useEffect } from 'react';
import { Button } from 'react-native';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import config from './config';

window.LOG_LEVEL = 'DEBUG';

Amplify.configure({
  Auth: config.cognito,
  ...config.appSync,
});

const mutation = `
mutation TestMutation($string: String!) {
  testMutation(string: $string) {
    value
  }
}
`;

const subscription = `
subscription OnTestMutations {
  onTestMutations {
    value
  }
}
`

const App = () => {

  useEffect(() => {  
    API.graphql(graphqlOperation(subscription)).subscribe({
      next: data => console.log('[SUBSCRIPTION DATA]', data),
      error: error => console.log('[SUBSCRIPTION ERROR]', error)
    })
  }, [])

  const fireMutation = () => {
    API.graphql(graphqlOperation(mutation, {string: 'testing testing...'}))
    .then(
      response => console.log('[MUTATION RESPONSE]',response)
    )
  }

  return (
    <Fragment>
      <Button onPress={fireMutation} title='Fire Mutation'/>
    </Fragment>
  );
};

export default App;
