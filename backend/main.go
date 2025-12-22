package main

import (
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
		user := new(User)

		if err := c.BodyParser(user); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request payload"})
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not hash password"})
		}
		user.Password = string(hash)

		if result := DB.Create(&user); result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Registration failed: email already exists or server error"})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "User successfully registered",
			"userId":  user.ID,
		})
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		req := new(LoginRequest)
		if err := c.BodyParser(req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request payload"})
		}

		var user User
		if result := DB.Where("email = ?", req.Email).First(&user); result.Error != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
		}

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
			"user":  user,
		})
	})

	log.Fatal(app.Listen(":8080"))
}
