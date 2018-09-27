package cards

import (
	"strings"

	"github.com/graphql-go/graphql"
)

func Resolve(p graphql.ResolveParams) (interface{}, error) {
	finalCards := []Card{}
	suit, suitOK := p.Args["suit"].(string)
	suit = strings.ToLower(suit)

	value, valueOK := p.Args["value"].(string)
	value = strings.ToLower(value)

	for _, card := range cards {
		if suitOK && suit != strings.ToLower(card.Suit) {
			continue
		}
		if valueOK && value != strings.ToLower(card.Value) {
			continue
		}

		finalCards = append(finalCards, card)
	}
	return finalCards, nil
}
