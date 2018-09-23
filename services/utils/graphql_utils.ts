import gql from 'graphql-tag';

console.log(gql`{ hello { name } }`);
/**
  output:

  { kind: 'Document',
    definitions: 
    [ { kind: 'OperationDefinition',
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: [Object] } ],
    loc: { start: 0, end: 18 } 
  }
 */