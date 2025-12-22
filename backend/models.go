package main

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"password"`
}


type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Flashcard struct {
	gorm.Model
	Front  string `json:"front"`
	Back   string `json:"back"`
	UserID uint   `json:"userId"`
}
