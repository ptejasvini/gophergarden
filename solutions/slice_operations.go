package main

import "fmt"

func main() {
	nums := []int{1, 2, 3, 4, 5}

	//append into slice
	nums = append(nums, 3)

	fmt.Println(nums)

	//length & capacity of a slice
	fmt.Println("Length", len(nums), "Capacity", cap(nums))

	//slicing and capacity
	slice := nums[0:4]

	//Capacity of a slice = number of elements from start index of the slice to the end of the underlying array.
	fmt.Println("Slice", slice, "Length ", len(slice), "Capacity", cap(slice))

}
