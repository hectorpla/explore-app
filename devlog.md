# integration of graphql
- initially tried to use GraphQLScheme, too painfully
- intergrated apollo-server, which accpects graphql schema and resolvers
- limitation: no link between types of SDL schema and the application/db objects
- graphql-tag doesn't intergrate well as client (the query is parsed)

# typescript and mongodb
We have to keep two places for typing (mongodb models & application types)

# challenges
## typing for application objects and mongodb object are different
```typescript
// application object (btw, this type can be generated by apollo codegen, but manually typed at the first time)
export interface IBusiness {
  name: string;
  categories: ICategory[];
  alias: string;
  url?: string;
  location?: ILocation;
  coordinates?: ICoordinates;
  photos: string[];
  reviews?: string[];
}

// MongoDB document
const BusinessSchema = new mongoose.Schema({
  name: String,
  alias: String,
  url: String,
  rating: Number,
  categories: [String],
  photos: [String],
} as { [key in keyof IBusiness]: any });
```
At this stage, can't guarantee that every field is semantically the same in the different type signature.
It would be great if there are checks to make sure `string[]` transforms to `[String]`.
Odd is that a mongoDB model field be defined like `{name: {type: String, unqiue: true}}`

## handling with growing GraphQL schema
For example, we want to change a terminal node in the schema tree to a non-terminal, that could be headache. Example:

> {photo: [String]}  
|  
v
> <pre> type Photo {  
>    url: String  
>    place_name: String  
>    place_id: String  
>  }  
> { photos: [Photo] } </pre>

The refactoring would be messy because change in the schema causes other changes:
- types of usage in the application (beneficial to implementation)
- db document type defintion
- there are no links between QraphQL schema and `resolver`!!!

### proposed solution
- use apollo-cli the generate types in ts
- maybe use TypeGraphQL libary (don't like the syntax: many annotation like java)
