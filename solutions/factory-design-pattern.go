package main

type Vehicle interface {
	Drive() string
}

type Car struct{}

func (c Car) Drive() string {
	return "Driving a car"
}

type Bike struct{}

func (b Bike) Drive() string {
	return "Driving a bike"
}

func GetVehicle(vehicleType string) Vehicle {
	if vehicleType == "Car" {
		return Car{}
	} else if vehicleType == "Bike" {
		return Bike{}
	} else {
		return nil
	}
}

func main() {
	car := GetVehicle("Car")
	println(car.Drive())

	bike := GetVehicle("Bike")
	println(bike.Drive())

}
