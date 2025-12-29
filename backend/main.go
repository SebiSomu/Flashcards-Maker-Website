package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	ConnectDatabase()

	app := fiber.New()
	app.Use(cors.New())

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.SendString("User Service is up and running!")
	})

	app.Post("/api/register", func(c *fiber.Ctx) error {
		var req RegisterRequest

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request payload"})
		}

		// Hash the password
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not hash password"})
		}

		// Create user with hashed password
		user := User{
			Email:    req.Email,
			Password: string(hash),
		}

		if result := DB.Create(&user); result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Registration failed: email already exists or server error"})
		}

		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": user.ID,
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		})

		t, err := token.SignedString([]byte("secret"))
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not generate token"})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "User successfully registered",
			"token":   t,
			"user":    user.ToResponse(),
		})
	})

	app.Post("/api/login", func(c *fiber.Ctx) error {
		var req LoginRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request payload"})
		}

		var user User
		if result := DB.Where("email = ?", req.Email).First(&user); result.Error != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
		}

		// Compare hashed password
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
		}

		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": user.ID,
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		})

		t, err := token.SignedString([]byte("secret"))
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not generate token"})
		}

		return c.JSON(fiber.Map{
			"token": t,
			"user":  user.ToResponse(), // Returns user without password
		})
	})

	// --- Flashcards API ---

	// Middleware/Helper to get User ID from Token
	getUserID := func(c *fiber.Ctx) (uint, error) {
		authHeader := c.Get("Authorization")
		if authHeader == "" || len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			return 0, fiber.NewError(fiber.StatusUnauthorized, "Missing or malformed token")
		}
		tokenString := authHeader[7:]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "Unexpected signing method")
			}
			return []byte("secret"), nil
		})

		if err != nil || !token.Valid {
			return 0, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return 0, fiber.NewError(fiber.StatusUnauthorized, "Invalid token claims")
		}

		sub, ok := claims["sub"].(float64)
		if !ok {
			return 0, fiber.NewError(fiber.StatusUnauthorized, "Invalid user ID in token")
		}

		return uint(sub), nil
	}

	app.Get("/api/flashcards", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		var flashcards []Flashcard
		if result := DB.Where("user_id = ?", userID).Find(&flashcards); result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not fetch flashcards"})
		}

		return c.JSON(flashcards)
	})

	app.Post("/api/flashcards", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		card := new(Flashcard)
		if err := c.BodyParser(card); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
		}

		card.UserID = userID
		if result := DB.Create(&card); result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not create flashcard"})
		}

		return c.Status(201).JSON(card)
	})

	app.Put("/api/flashcards/:id", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		id := c.Params("id")
		var card Flashcard

		if result := DB.Where("id = ? AND user_id = ?", id, userID).First(&card); result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Flashcard not found or access denied"})
		}

		type UpdateData struct {
			Front    string `json:"front"`
			Back     string `json:"back"`
			FolderID *uint  `json:"folderId"`
			// SM2 Fields
			NextReviewAt *string    `json:"nextReviewAt,omitempty"`
			Interval     *float64   `json:"interval,omitempty"`
			EaseFactor   *float64   `json:"easeFactor,omitempty"`
			Repetitions  *int       `json:"repetitions,omitempty"`
		}
		var updateData UpdateData
		if err := c.BodyParser(&updateData); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid data: " + err.Error()})
		}

		card.Front = updateData.Front
		card.Back = updateData.Back
		card.FolderID = updateData.FolderID

		// Update SM2 fields if present
		if updateData.NextReviewAt != nil {
			parsedTime, err := time.Parse(time.RFC3339, *updateData.NextReviewAt)
			if err == nil {
				card.NextReviewAt = parsedTime
			} else {
                fmt.Println("Error parsing time:", err)
            }
		}
		if updateData.Interval != nil {
			card.Interval = *updateData.Interval
		}
		if updateData.EaseFactor != nil {
			card.EaseFactor = *updateData.EaseFactor
		}
		if updateData.Repetitions != nil {
			card.Repetitions = *updateData.Repetitions
		}

		DB.Save(&card)

		return c.JSON(card)
	})

	app.Delete("/api/flashcards/:id", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		id := c.Params("id")
		var card Flashcard

		if result := DB.Where("id = ? AND user_id = ?", id, userID).First(&card); result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Flashcard not found or access denied"})
		}

		DB.Unscoped().Delete(&card)
		return c.Status(200).JSON(fiber.Map{"message": "Deleted successfully"})
	})

	// --- Folder API ---

	app.Get("/api/folders", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		var folders []Folder
		if result := DB.Where("user_id = ?", userID).Find(&folders); result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not fetch folders"})
		}
		return c.JSON(folders)
	})

	app.Post("/api/folders", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		folder := new(Folder)
		if err := c.BodyParser(folder); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
		}

		folder.UserID = userID
		if result := DB.Create(&folder); result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not create folder"})
		}
		return c.Status(201).JSON(folder)
	})

	app.Delete("/api/folders/:id", func(c *fiber.Ctx) error {
		userID, err := getUserID(c)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		id := c.Params("id")
		var folder Folder
		if result := DB.Where("id = ? AND user_id = ?", id, userID).First(&folder); result.Error != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Folder not found or access denied"})
		}

		// Set flashcard folder_id to null for cards in this folder
		DB.Model(&Flashcard{}).Where("folder_id = ?", folder.ID).Update("folder_id", nil)

		DB.Unscoped().Delete(&folder)
		return c.Status(200).JSON(fiber.Map{"message": "Folder deleted"})
	})

	// --- User Settings API ---
	
		app.Post("/api/user/dismiss-smart-review", func(c *fiber.Ctx) error {
			userID, err := getUserID(c)
			if err != nil {
				return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
			}
	
			// Request body can specify duration, or default to 24h
			type DismissRequest struct {
				Hours int `json:"hours"`
			}
			var req DismissRequest
			// Ignore error if body is empty or invalid, default to 24
			_ = c.BodyParser(&req)
			if req.Hours <= 0 {
				req.Hours = 24
			}
	
			dismissUntil := time.Now().Add(time.Duration(req.Hours) * time.Hour)
	
			// Update user
			if result := DB.Model(&User{}).Where("id = ?", userID).Update("smart_review_dismissed_until", dismissUntil); result.Error != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Could not update user settings"})
			}
	
			return c.JSON(fiber.Map{"message": "Smart review dismissed", "until": dismissUntil})
		})
		
		// Add an endpoint to get current user info including settings
		app.Get("/api/me", func(c *fiber.Ctx) error {
			userID, err := getUserID(c)
			if err != nil {
				return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
			}
	
			var user User
			if result := DB.First(&user, userID); result.Error != nil {
				return c.Status(404).JSON(fiber.Map{"error": "User not found"})
			}
	
			return c.JSON(user.ToResponse())
		})
	
		log.Fatal(app.Listen(":8080"))
	}
