package main

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email                     string     `gorm:"unique;not null" json:"email"`
	Password                  string     `gorm:"not null" json:"-"`
	SmartReviewDismissedUntil *time.Time `json:"smartReviewDismissedUntil"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	ID                        uint       `json:"id"`
	Email                     string     `json:"email"`
	CreatedAt                 time.Time  `json:"createdAt"`
	UpdatedAt                 time.Time  `json:"updatedAt"`
	SmartReviewDismissedUntil *time.Time `json:"smartReviewDismissedUntil"`
}

type Folder struct {
	gorm.Model
	Name     string   `json:"name"`
	UserID   uint     `json:"userId"`
	ParentID *uint    `json:"parentId"`
	Children []Folder `gorm:"foreignkey:ParentID" json:"children,omitempty"`
}

type Flashcard struct {
	gorm.Model
	Front    string `json:"front"`
	Back     string `json:"back"`
	UserID   uint   `json:"userId"`
	FolderID *uint  `json:"folderId"`

	NextReviewAt time.Time `json:"nextReviewAt"`
	Interval     float64   `json:"interval"` // Days
	EaseFactor   float64   `json:"easeFactor"`
	Repetitions  int       `json:"repetitions"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:                        u.ID,
		Email:                     u.Email,
		CreatedAt:                 u.CreatedAt,
		UpdatedAt:                 u.UpdatedAt,
		SmartReviewDismissedUntil: u.SmartReviewDismissedUntil,
	}
}
