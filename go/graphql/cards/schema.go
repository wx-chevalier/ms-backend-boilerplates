package cards

import "github.com/graphql-go/graphql"

func Setup() (graphql.Schema, error) {
	cardType := CardType()

	fields := graphql.Fields{
		"cards": &graphql.Field{
			Type: graphql.NewList(cardType),
			Args: graphql.FieldConfigArgument{
				"suit": &graphql.ArgumentConfig{
					Description: "Filter cards by card suit (hearts, clubs, diamonds, spades)",
					Type:        graphql.String,
				},
				"value": &graphql.ArgumentConfig{
					Description: "Filter cards by card value (A-K)",
					Type:        graphql.String,
				},
			},
			Resolve: Resolve,
		},
	}

	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)

	return schema, err
}
