import { gql, ApolloServer, UserInputError } from "apollo-server";
import {v1 as uuid} from 'uuid';
import axios from "axios"; 


const persons = [
    {
        name: "Ivan",
        phone: "123",
        street: "Calle Frontend",
        city: "Barcelona",
        id: "51531351ddededed1531dede"
    },
    {
        name: "Youseff",
        phone: "5544458913",
        street: "Avenida fullstack",
        city: "Mataro",
        id: "5153dedededeede"
    },
    {
        name: "Xochitl",
        street: "Calle Frontend",
        city: "Ibiza",
        id: "515313-51-ddede-ded1531dede"
    },
]

// Definir elementos
const typeDefinitions = gql`

    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person]!
        findPerson(name: String): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
        editNumber(
            name: String!
            phone: String!
        ): Person
    }
`
// Como resolver los datos
const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: async (root, args) => {
            // Desde una api rest
            const {data: personsFromRestApi} = await axios.get('http://localhost:3000/persons')

            if(!args.phone) return personsFromRestApi

            const byPhone = person =>
                args.phone == "YES" ? person.phone : !person.phone 

            return personsFromRestApi.filter(byPhone)


        },
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            // Validacion
            if(persons.find(p => p.name === args.name)){
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            // const {name, phone, street, city} = args
            const person = {...args, id: uuid()}
            persons.push(person) //Update database with new person
            return person
        },
        editNumber: (root, args) => {
            const personIndex = persons.findIndex(p => p.name === args.name)
            if (personIndex === -1) return null

            const person = persons[personIndex]

            const updatedPerson = {...person, phone: args.phone}
            persons[personIndex] = updatedPerson

            return updatedPerson

        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

// Definir apollo-server
const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
})

// Inicializar servidor
server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})