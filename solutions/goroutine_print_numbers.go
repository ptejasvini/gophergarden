package main

import (
	"fmt"
	"time"
)

func main() {
	n := 5
	go func() {
		for i := 0; i < n; i++ {
			fmt.Println(i)
		}
	}()
	time.Sleep(100 * time.Millisecond)
}
