package main

import "strings"

func main() {
	senctence := "go is super fast and powerful"

	wordCount := make(map[string]int)

	for _, word := range strings.Split(senctence, " ") {
		wordCount[word]++
	}

	for k, v := range wordCount {
		println(k, v)
	}
}
