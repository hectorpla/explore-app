# integration of graphql
- initially tried to use GraphQLScheme, too painfully
- intergrated apollo-server, which accpects graphql schema and resolvers
- limitation: no link between types of SDL schema and the application/db objects
- graphql-tag doesn't intergrate well as client (the query is parsed)

# typescript and mongodb
- keep two places for typing (mongodb models & application types)
