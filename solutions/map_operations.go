package main

import "fmt"

func main() {

	m := map[string]int{"a": 1, "b": 2, "c": 3}
	fmt.Println(m)

	m["d"] = 4
	fmt.Println(m)

	delete(m, "a")
	fmt.Println(m)

	val, ok := m["b"]
	fmt.Println(val, ok)
	for k, v := range m {
		fmt.Println(k, v)
	}

}
