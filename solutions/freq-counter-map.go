package main

import "fmt"

func main() {
	str := "hello world"

	freqMap := make(map[rune]int)

	for _, char := range str {
		freqMap[char]++
	}
	for k, v := range freqMap {
		fmt.Printf("%q: %d\n", k, v)
	}
}
