package main

import (
	"fmt"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	database, err := gorm.Open(sqlite.Open("flashcraft.db"), &gorm.Config{})

	if err != nil {
		fmt.Println("Connection error:", err)
		panic("Failed to connect to database!")
	}

	err = database.AutoMigrate(&User{}, &Flashcard{}, &Folder{})
	if err != nil {
		fmt.Println("Migration error:", err)
	}

	DB = database
	fmt.Println("Database connected successfully!")
}
