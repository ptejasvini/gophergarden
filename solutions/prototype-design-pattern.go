package main

import "fmt"

type User struct {
	name string
	ID   int
}

func (u *User) Clone() *User {
	clone := *u
	return &clone
}

func main() {
	userObj1 := &User{
		name: "doe",
		ID:   1,
	}

	userObj2 := userObj1.Clone()

	userObj2.name = "Darling"

	fmt.Printf("User1: %+v\n", userObj1)
	fmt.Printf("User2: %+v\n", userObj2)
}
