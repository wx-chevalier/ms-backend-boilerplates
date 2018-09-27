package cards

import (
	"reflect"
	"testing"

	"github.com/graphql-go/graphql"
)

func TestResolve(t *testing.T) {
	type args struct {
		p graphql.ResolveParams
	}
	tests := []struct {
		name    string
		args    args
		want    interface{}
		wantErr bool
	}{
		{"base-case", args{graphql.ResolveParams{}}, cards, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Resolve(tt.args.p)
			if (err != nil) != tt.wantErr {
				t.Errorf("Resolve() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Resolve() = %v, want %v", got, tt.want)
			}
		})
	}
}
