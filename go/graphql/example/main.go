package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/agtorre/go-solutions/section4/graphql/cards"
	"github.com/graphql-go/graphql"
)

func main() {
	schema, err := cards.Setup()
	if err != nil {
		panic(err)
	}

	query := `
		{
			cards(value: "A"){
				value
				suit
			}
		}
	`
	params := graphql.Params{Schema: schema, RequestString: query}
	r := graphql.Do(params)
	if len(r.Errors) > 0 {
		log.Fatalf("failed to execute graphql operation, errors: %+v", r.Errors)
	}
	rJSON, err := json.MarshalIndent(r, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s \n", rJSON)
}
