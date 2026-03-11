---
title: Prototype Design Pattern - Object Cloning
difficulty: Easy
tags: [golang, design-pattern, prototype]
-----------------------------------------

## Problem Description

Write a Go program that demonstrates the **Prototype Design Pattern** by cloning an existing object.

Create a `User` struct with fields `name` and `ID`. Implement a `Clone()` method that returns a copy of the current object. The cloned object should be independent so that modifying the clone does not affect the original object.

The program should:

* Create an original `User` object
* Clone it using the `Clone()` method
* Modify the cloned object's name
* Print both objects to verify they are different instances.

## Examples

**Example 1:**

Input: NA

Output:

User1: &{name:doe ID:1}
User2: &{name:Darling ID:1}

Explanation:

* `User1` is the original object.
* `User2` is a cloned object created using the Prototype pattern.
* Changing `User2.name` does **not affect** `User1`.

## Constraints

* Struct cloning should be implemented using a `Clone()` method.
* The clone should create a **new independent object**.
* Use **shallow copy** for primitive fields.

