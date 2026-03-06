package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	wg.Go(func() {
		fmt.Println("Goroutine 1")
	})
	wg.Go(func() {
		fmt.Println("Goroutine 2")
	})
	wg.Go(func() {
		fmt.Println("Goroutine 3")
	})
	wg.Wait()
}
