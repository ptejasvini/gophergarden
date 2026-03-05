package main

import "fmt"

func swapWithoutTemp(a,b int) (int, int) {
    a = a+b 
	b = a-b 
	a = a-b 
	return a, b
}

func main() {
    a, b := 5, 10
    a, b = swapWithoutTemp(a, b)
    fmt.Println(a, b)
}